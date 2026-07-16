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
});
