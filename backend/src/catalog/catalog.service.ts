import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { ProductAttributeType } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";
import { ProductQueryDto, ProductSort } from "./dto/product-query.dto.js";

const productInclude = {
  variant: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  categories: { select: { categoryId: true } },
};

export interface CategoryTreeNode {
  id: string;
  key: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: CategoryTreeNode[];
}

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async categoryTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.prisma.category.findMany({ orderBy: [{ parentId: "asc" }, { name: "asc" }] });
    const nodes = new Map<string, CategoryTreeNode>(
      categories.map((category) => [category.id, { ...category, children: [] }])
    );
    const roots: CategoryTreeNode[] = [];
    for (const node of nodes.values()) {
      if (node.parentId) nodes.get(node.parentId)?.children.push(node);
      else roots.push(node);
    }
    return roots;
  }

  async products(query: ProductQueryDto) {
    const attributeFilters: Prisma.ProductWhereInput[] = [];
    if (query.colors?.length) {
      attributeFilters.push({
        attributes: { some: { type: ProductAttributeType.COLOR, value: { in: query.colors } } },
      });
    }
    if (query.sizes?.length) {
      attributeFilters.push({ attributes: { some: { type: ProductAttributeType.SIZE, value: { in: query.sizes } } } });
    }
    if (query.equipmentTypes?.length) {
      attributeFilters.push({
        attributes: { some: { type: ProductAttributeType.EQUIPMENT_TYPE, value: { in: query.equipmentTypes } } },
      });
    }

    const variantWhere: Prisma.ProductVariantWhereInput = {
      ...(query.minPrice !== undefined ? { priceAmount: { gte: query.minPrice } } : {}),
      ...(query.maxPrice !== undefined
        ? { priceAmount: { ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}), lte: query.maxPrice } }
        : {}),
    };
    const baseWhere: Prisma.ProductWhereInput = {
      isActive: true,
      variant: Object.keys(variantWhere).length ? { is: variantWhere } : { isNot: null },
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(attributeFilters.length ? { AND: attributeFilters } : {}),
    };
    const orderBy = this.orderBy(query.sort);
    const [items, total] = await this.prisma.$transaction(async (tx) => {
      const categoryIds = query.categoryId ? await this.categoryScope(tx, query.categoryId) : undefined;
      const where: Prisma.ProductWhereInput = {
        ...baseWhere,
        ...(categoryIds ? { categories: { some: { categoryId: { in: categoryIds } } } } : {}),
      };
      const page = await tx.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip: query.offset,
        take: query.limit,
      });
      const count = await tx.product.count({ where });
      return [page, count] as const;
    });
    return {
      items: items.map((product) => this.toProductDto(product)),
      offset: query.offset,
      limit: query.limit,
      total,
    };
  }

  async filters(categoryId?: string) {
    const categoryIds = categoryId ? await this.categoryScope(this.prisma, categoryId) : undefined;
    const productWhere: Prisma.ProductWhereInput = {
      isActive: true,
      variant: { isNot: null },
      ...(categoryIds ? { categories: { some: { categoryId: { in: categoryIds } } } } : {}),
    };

    const [priceRows, colors, sizes, equipmentTypes] = await Promise.all([
      this.prisma.productVariant.findMany({ where: { product: productWhere }, select: { priceAmount: true } }),
      this.attributeOptions(productWhere, ProductAttributeType.COLOR),
      this.attributeOptions(productWhere, ProductAttributeType.SIZE),
      this.attributeOptions(productWhere, ProductAttributeType.EQUIPMENT_TYPE),
    ]);

    const prices = priceRows.map((row) => row.priceAmount);
    return {
      price: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 },
      colors,
      sizes,
      equipmentTypes,
    };
  }

  private async attributeOptions(productWhere: Prisma.ProductWhereInput, type: ProductAttributeType) {
    const values = await this.prisma.productAttribute.findMany({
      where: { type, product: productWhere },
      select: { value: true },
      distinct: ["value"],
      orderBy: { value: "asc" },
    });
    return Promise.all(
      values.map(async ({ value }) => ({
        value,
        count: await this.prisma.productAttribute.count({ where: { type, value, product: productWhere } }),
      }))
    );
  }

  private async categoryScope(tx: Prisma.TransactionClient | PrismaService, categoryId: string): Promise<string[]> {
    const categories = await tx.category.findMany({ select: { id: true, parentId: true } });
    const categoryIds = new Set([categoryId]);

    let foundDescendant = true;
    while (foundDescendant) {
      foundDescendant = false;
      for (const category of categories) {
        if (category.parentId && categoryIds.has(category.parentId) && !categoryIds.has(category.id)) {
          categoryIds.add(category.id);
          foundDescendant = true;
        }
      }
    }

    return [...categoryIds];
  }

  async product(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isActive: true },
      include: productInclude,
    });
    if (!product?.variant) throw new NotFoundException("Product not found");
    return this.toProductDto(product);
  }

  private orderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case ProductSort.PRICE_ASC:
        return [{ variant: { priceAmount: "asc" } }, { id: "asc" }];
      case ProductSort.PRICE_DESC:
        return [{ variant: { priceAmount: "desc" } }, { id: "asc" }];
      case ProductSort.NAME_ASC:
        return [{ name: "asc" }, { id: "asc" }];
      case ProductSort.NAME_DESC:
        return [{ name: "desc" }, { id: "asc" }];
      default:
        return [{ createdAt: "desc" }, { id: "asc" }];
    }
  }

  private toProductDto(product: Prisma.ProductGetPayload<{ include: typeof productInclude }>) {
    if (!product.variant) throw new NotFoundException("Product variant not found");
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
      price: { amount: product.variant.priceAmount, currency: product.variant.currency },
      compareAtPrice:
        product.variant.compareAtPriceAmount == null
          ? null
          : { amount: product.variant.compareAtPriceAmount, currency: product.variant.currency },
      categoryIds: product.categories.map((item) => item.categoryId),
    };
  }
}
