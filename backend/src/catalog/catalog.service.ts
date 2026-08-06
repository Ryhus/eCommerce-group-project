import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
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
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      variant: { isNot: null },
      ...(query.categoryId ? { categories: { some: { categoryId: query.categoryId } } } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy = this.orderBy(query.sort);
    const [items, total] = await this.prisma.$transaction(async (tx) => {
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
