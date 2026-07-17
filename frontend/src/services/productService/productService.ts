import { apiClient } from "../apiClient";
import type { Product } from "./types";

interface ProductDto {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: { url: string; alt: string }[];
  price: { amount: number; currency: "EUR" };
  compareAtPrice: { amount: number; currency: "EUR" } | null;
}

interface ProductPageDto {
  items: ProductDto[];
  offset: number;
  limit: number;
  total: number;
}

const sortMap: Record<string, string> = {
  "price asc": "PRICE_ASC",
  "price desc": "PRICE_DESC",
  "name.en asc": "NAME_ASC",
  "name.en desc": "NAME_DESC",
};

function mapProduct(item: ProductDto): Product {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? "",
    imgUrls: item.images.map((image) => image.url),
    currentPrice: item.price.amount,
    oldPrice: item.compareAtPrice?.amount ?? item.price.amount,
  };
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    return mapProduct((await apiClient.get<ProductDto>(`/catalog/products/${productId}`)).data);
  } catch {
    return null;
  }
}

export async function fetchProducts(sort?: string, offset = 0, limit = 20): Promise<Product[]> {
  const response = await apiClient.get<ProductPageDto>("/catalog/products", {
    params: { sort: sort ? sortMap[sort] : "RELEVANCE", offset, limit },
  });
  return response.data.items.map(mapProduct);
}

export async function fetchProductsByCategory(
  categoryId: string,
  sort?: string,
  offset = 0,
  limit = 20
): Promise<Product[]> {
  const response = await apiClient.get<ProductPageDto>("/catalog/products", {
    params: { categoryId, sort: sort ? sortMap[sort] : "RELEVANCE", offset, limit },
  });
  return response.data.items.map(mapProduct);
}
