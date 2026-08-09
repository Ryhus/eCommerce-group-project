import { isAxiosError } from "axios";

import { apiClient } from "../apiClient";
import type { CatalogFilters, Product, ProductFilterState, ProductPage } from "./types";

interface ProductDto {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: { url: string; alt: string }[];
  price: { amount: number; currency: "EUR" };
  compareAtPrice: { amount: number; currency: "EUR" } | null;
  categoryIds: string[];
}

interface ProductPageDto {
  items: ProductDto[];
  offset: number;
  limit: number;
  total: number;
}

type CatalogFiltersDto = CatalogFilters;

const sortMap: Record<string, string> = {
  "price asc": "PRICE_ASC",
  "price desc": "PRICE_DESC",
  "name.en asc": "NAME_ASC",
  "name.en desc": "NAME_DESC",
};

export interface ProductListQuery extends Partial<ProductFilterState> {
  categoryId?: string;
  sort?: string;
  search?: string;
  offset?: number;
  limit?: number;
}

function mapProduct(item: ProductDto): Product {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? "",
    imgUrls: item.images.map((image) => image.url),
    categoryIds: item.categoryIds,
    currentPrice: item.price.amount,
    oldPrice: item.compareAtPrice?.amount ?? item.price.amount,
  };
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    return mapProduct((await apiClient.get<ProductDto>(`/catalog/products/${productId}`)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

export async function fetchProductPage({
  categoryId,
  sort,
  search,
  minPrice,
  maxPrice,
  colors,
  sizes,
  equipmentTypes,
  offset = 0,
  limit = 20,
}: ProductListQuery = {}): Promise<ProductPage> {
  const normalizedSearch = search?.trim();
  const response = await apiClient.get<ProductPageDto>("/catalog/products", {
    params: {
      ...(categoryId ? { categoryId } : {}),
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
      ...(colors?.length ? { colors: colors.join(",") } : {}),
      ...(sizes?.length ? { sizes: sizes.join(",") } : {}),
      ...(equipmentTypes?.length ? { equipmentTypes: equipmentTypes.join(",") } : {}),
      sort: sort ? sortMap[sort] : "RELEVANCE",
      offset,
      limit,
    },
  });
  return {
    items: response.data.items.map(mapProduct),
    offset: response.data.offset,
    limit: response.data.limit,
    total: response.data.total,
  };
}

export async function fetchCatalogFilters(categoryId?: string): Promise<CatalogFilters> {
  const response = await apiClient.get<CatalogFiltersDto>("/catalog/filters", {
    params: categoryId ? { categoryId } : undefined,
  });
  return response.data;
}

export async function fetchProducts(query: ProductListQuery = {}): Promise<Product[]> {
  return (await fetchProductPage(query)).items;
}
