import { describe, expect, it, vi } from "vitest";
import { CatalogService } from "./catalog.service.js";
import { ProductQueryDto, ProductSort } from "./dto/product-query.dto.js";

describe("CatalogService", () => {
  it("builds a deterministic category tree", async () => {
    const prisma = {
      category: {
        findMany: vi.fn().mockResolvedValue([
          { id: "root", key: "sports", name: "Sports", slug: "sports", parentId: null },
          { id: "child-a", key: "fitness", name: "Fitness", slug: "fitness", parentId: "root" },
          { id: "child-b", key: "running", name: "Running", slug: "running", parentId: "root" },
        ]),
      },
    };

    const result = await new CatalogService(prisma as never).categoryTree();

    expect(result).toHaveLength(1);
    expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: [{ parentId: "asc" }, { name: "asc" }] });
    expect(result[0]).toMatchObject({ id: "root", children: [{ id: "child-a" }, { id: "child-b" }] });
  });

  it("sorts products by price with a stable id tie-breaker", async () => {
    const transaction = {
      product: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction)),
    };
    const query = Object.assign(new ProductQueryDto(), { sort: ProductSort.PRICE_ASC, offset: 10, limit: 5 });

    await new CatalogService(prisma as never).products(query);

    expect(transaction.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ variant: { priceAmount: "asc" } }, { id: "asc" }],
        skip: 10,
        take: 5,
      })
    );
  });

  it("searches active products by name or description without case sensitivity", async () => {
    const transaction = {
      product: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction)),
    };
    const query = Object.assign(new ProductQueryDto(), { search: "shirt" });

    await new CatalogService(prisma as never).products(query);

    const where = {
      isActive: true,
      variant: { isNot: null },
      OR: [
        { name: { contains: "shirt", mode: "insensitive" } },
        { description: { contains: "shirt", mode: "insensitive" } },
      ],
    };

    expect(transaction.product.findMany).toHaveBeenCalledWith(expect.objectContaining({ where }));
    expect(transaction.product.count).toHaveBeenCalledWith({ where });
  });

  it("includes descendant categories when filtering by a parent category", async () => {
    const transaction = {
      category: {
        findMany: vi.fn().mockResolvedValue([
          { id: "balls", parentId: null },
          { id: "football", parentId: "balls" },
          { id: "youth-football", parentId: "football" },
          { id: "fitness", parentId: null },
        ]),
      },
      product: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction)),
    };
    const query = Object.assign(new ProductQueryDto(), { categoryId: "balls" });

    await new CatalogService(prisma as never).products(query);

    const where = expect.objectContaining({
      categories: { some: { categoryId: { in: ["balls", "football", "youth-football"] } } },
    });
    expect(transaction.product.findMany).toHaveBeenCalledWith(expect.objectContaining({ where }));
    expect(transaction.product.count).toHaveBeenCalledWith({ where });
  });

  it("combines price and attribute filters on the server", async () => {
    const transaction = {
      product: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction)),
    };
    const query = Object.assign(new ProductQueryDto(), {
      minPrice: 2500,
      maxPrice: 8000,
      colors: ["blue"],
      sizes: ["standard"],
      equipmentTypes: ["hydration"],
    });

    await new CatalogService(prisma as never).products(query);

    expect(transaction.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isActive: true,
          variant: { is: { priceAmount: { gte: 2500, lte: 8000 } } },
          AND: [
            { attributes: { some: { type: "COLOR", value: { in: ["blue"] } } } },
            { attributes: { some: { type: "SIZE", value: { in: ["standard"] } } } },
            { attributes: { some: { type: "EQUIPMENT_TYPE", value: { in: ["hydration"] } } } },
          ],
        },
      })
    );
  });
});
