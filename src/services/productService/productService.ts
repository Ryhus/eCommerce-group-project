// Import existing types and apiClient
import type { Product } from "./types.ts";
import { apiClient } from "../apiClient.ts";

const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

// Fetch a product by key
export async function fetchProductByKey(productKey: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<{
      id: string;
      name: { en: string };
      slug: { en: string };
      description?: { en?: string };
      masterVariant: {
        images: { url: string }[];
        prices: Array<{
          value: { centAmount: number };
          discounted?: { value: { centAmount: number } };
        }>;
      };
    }>(`/${PROJECT_KEY}/product-projections/key=${productKey}`);

    const item = response.data;
    const price = item.masterVariant.prices?.[0];

    return {
      id: item.id,
      name: item.name?.en ?? "No Name Available",
      slug: item.slug?.en ?? "",
      description: item.description?.en ?? "",
      imgUrls: item.masterVariant.images?.map((img) => img.url) ?? [],
      currentPrice: price?.discounted?.value.centAmount ?? price?.value.centAmount ?? 0,
      oldPrice: price?.value.centAmount ?? 0,
    };
  } catch (error) {
    console.error(`Error fetching product with key ${productKey}:`, error);
    return null;
  }
}

// Fetch a product by ID
export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<{
      masterData: {
        current: {
          id: string;
          name: { en: string };
          slug: { en: string };
          description?: { en?: string };
          masterVariant: {
            images?: { url: string }[];
            prices?: {
              value: { centAmount: number };
              discounted?: { value: { centAmount: number } };
            }[];
          };
        };
      };
    }>(`/${PROJECT_KEY}/products/${productId}`);

    const item = response.data.masterData.current;
    const price = item.masterVariant?.prices?.[0];

    return {
      id: productId,
      name: item.name.en,
      slug: item.slug.en ?? "",
      description: item.description?.en ?? "",
      imgUrls: item.masterVariant.images?.map((img) => img.url) ?? [],
      currentPrice: price?.discounted?.value.centAmount ?? price?.value.centAmount ?? 0,
      oldPrice: price?.value.centAmount ?? 0,
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return null;
  }
}

// Fetch all products (supports sorting + pagination)
export async function fetchProducts(
  sort: string | undefined,
  offset: number = 0,
  limit: number = 20
): Promise<Product[]> {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
  };
  if (sort) params.sort = sort;

  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      description: { en: string };
      masterVariant: {
        images?: { url: string }[];
        prices?: Array<{
          value: { centAmount: number };
          discounted?: { value: { centAmount: number } };
        }>;
      };
    }>;
  }>(`/${PROJECT_KEY}/product-projections/search`, { params });

  return response.data.results.map((item) => {
    const price = item.masterVariant.prices?.[0];
    return {
      id: item.id,
      name: item.name.en,
      slug: "",
      description: item.description.en,
      imgUrls: item.masterVariant.images?.map((img) => img.url) ?? [],
      currentPrice: price?.discounted?.value.centAmount ?? price?.value.centAmount ?? 0,
      oldPrice: price?.value.centAmount ?? 0,
    };
  });
}

// Fetch products by category (supports sorting + pagination)
export async function fetchProductsByCategory(
  categoryId: string,
  sort: string | undefined,
  offset: number = 0,
  limit: number = 20
): Promise<Product[]> {
  const params: Record<string, string> = {
    filter: `categories.id:"${categoryId}"`,
    limit: limit.toString(),
    offset: offset.toString(),
  };
  if (sort) params.sort = sort;

  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      description: { en: string };
      slug: { en: string };
      masterVariant: {
        images?: { url: string }[];
        prices?: Array<{
          value: { centAmount: number };
          discounted?: { value: { centAmount: number } };
        }>;
      };
    }>;
  }>(`/${PROJECT_KEY}/product-projections/search`, { params });

  return response.data.results.map((item) => {
    const price = item.masterVariant.prices?.[0];
    return {
      id: item.id,
      name: item.name.en,
      description: item.description.en,
      slug: item.slug.en,
      imgUrls: item.masterVariant.images?.map((img) => img.url) ?? [],
      currentPrice: price?.discounted?.value.centAmount ?? price?.value.centAmount ?? 0,
      oldPrice: price?.value.centAmount ?? 0,
    };
  });
}
