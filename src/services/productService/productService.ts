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

    const masterVariant = item.masterVariant;
    if (!masterVariant) {
      console.warn(`Product with key ${productKey} has no master variant.`);
      return {
        id: item.id,
        name: item.name?.en ?? "No Name Available",
        slug: item.slug?.en ?? "",
        description: item.description?.en ?? "",
        imgUrls: [],
        currentPrice: 0,
        oldPrice: 0,
      };
    }

    const priceEntry = item.masterVariant.prices?.[0];
    if (!priceEntry) {
      console.warn(`Product with key ${productKey} has no price set.`);
      return {
        id: item.id,
        name: item.name.en,
        slug: item.slug.en ?? "",
        description: item.description?.en ?? "",
        imgUrls: item.masterVariant.images?.map((img) => img.url) ?? [],
        currentPrice: 0,
        oldPrice: 0,
      };
    }

    const currentPriceiInCents =
      item.masterVariant.prices[0].discounted?.value.centAmount ?? item.masterVariant.prices[0].value.centAmount;
    const oldPriceiInCents = item.masterVariant.prices[0].value.centAmount;

    return {
      id: item.id,
      name: item.name.en,
      slug: item.slug.en ?? "",
      description: item.description?.en ?? "",
      imgUrls: item.masterVariant.images.map((img) => img.url),
      currentPrice: currentPriceiInCents,
      oldPrice: oldPriceiInCents,
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

    if (!item.masterVariant?.prices || item.masterVariant.prices.length === 0) {
      throw new Error("No price info found");
    }

    const currentPriceInCents =
      item.masterVariant.prices[0].discounted?.value.centAmount ?? item.masterVariant.prices[0].value.centAmount;
    const oldPriceInCents = item.masterVariant.prices[0].value.centAmount;

    return {
      id: productId,
      name: item.name.en,
      slug: item.slug.en ?? "",
      description: item.description?.en ?? "",
      imgUrls: (item.masterVariant.images ?? []).map((img: { url: string }) => img.url),
      currentPrice: currentPriceInCents,
      oldPrice: oldPriceInCents,
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return null;
  }
}

//Fetch ALL products
// GET /<PROJECT_KEY>/product-projections/search"

export async function fetchProducts(sort: string | undefined): Promise<Product[]> {
  const params: Record<string, string> = {};
  if (sort) {
    params.sort = sort;
  }

  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      description: { en: string };
      masterVariant: {
        images: { url: string }[];
        prices: Array<{
          value: { centAmount: number };
          discounted?: { value: { centAmount: number } };
        }>;
      };
    }>;
  }>(`/${PROJECT_KEY}/product-projections/search`, {
    params,
  });

  return response.data.results.map((item) => {
    const currentPriceiInCents =
      item.masterVariant.prices[0].discounted?.value.centAmount ?? item.masterVariant.prices[0].value.centAmount;
    const oldPriceiInCents = item.masterVariant.prices[0].value.centAmount;

    return {
      id: item.id,
      name: item.name.en,
      slug: "",
      description: item.description.en,
      imgUrls: item.masterVariant.images.map((img: { url: string }) => img.url),
      currentPrice: currentPriceiInCents,
      oldPrice: oldPriceiInCents,
    };
  });
}

//Fetch products by category ID
// GET /<PROJECT_KEY>/product-projections/search?filter.categories.id:"<categoryId>"

export async function fetchProductsByCategory(categoryId: string, sort: string | undefined): Promise<Product[]> {
  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      description: { en: string };
      slug: { en: string };
      masterVariant: {
        images: { url: string }[];
        prices: Array<{
          value: { centAmount: number; currencyCode: string };
          discounted?: { value: { centAmount: number } };
        }>;
      };
    }>;
  }>(`/${PROJECT_KEY}/product-projections/search`, {
    params: {
      filter: `categories.id:"${categoryId}"`,
      ...(sort ? { sort } : {}),
      limit: "50",
    },
  });

  return response.data.results.map((item) => {
    const currentPriceiInCents =
      item.masterVariant.prices[0].discounted?.value.centAmount ?? item.masterVariant.prices[0].value.centAmount;
    const oldPriceiInCents = item.masterVariant.prices[0].value.centAmount;

    return {
      id: item.id,
      name: item.name.en,
      description: item.description.en,
      slug: item.slug.en,
      imgUrls: item.masterVariant.images.map((img) => img.url),
      currentPrice: currentPriceiInCents,
      oldPrice: oldPriceiInCents,
    };
  });
}
