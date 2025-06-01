import type { Product } from "./types.js";
import { apiClient } from "../apiClient.js";

const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

//Fetch ALL products
// GET /<PROJECT_KEY>/product-projections/search"

export async function fetchProducts(): Promise<Product[]> {
  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      masterVariant: {
        images: { url: string }[];
        prices: Array<{
          value: { centAmount: number };
          discounted?: { value: { centAmount: number } };
        }>;
      };
    }>;
  }>(`/${PROJECT_KEY}/product-projections/search`);
  return response.data.results.map((item) => {
    const currentPriceiInCents =
      item.masterVariant.prices[0].discounted?.value.centAmount ?? item.masterVariant.prices[0].value.centAmount;
    const oldPriceiInCents = item.masterVariant.prices[0].value.centAmount;

    return {
      id: item.id,
      name: item.name.en,
      slug: "",
      imgUrls: item.masterVariant.images.map((img) => img.url),
      currentPrice: currentPriceiInCents,
      oldPrice: oldPriceiInCents,
    };
  });
}

//Fetch products by category ID
// GET /<PROJECT_KEY>/product-projections/search?filter.categories.id:"<categoryId>"

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
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
    params: { filter: `categories.id:"${categoryId}"`, limit: 50 },
  });

  return response.data.results.map((item) => {
    const currentPriceiInCents =
      item.masterVariant.prices[0].discounted?.value.centAmount ?? item.masterVariant.prices[0].value.centAmount;
    const oldPriceiInCents = item.masterVariant.prices[0].value.centAmount;

    return {
      id: item.id,
      name: item.name.en,
      slug: item.slug.en,
      imgUrls: item.masterVariant.images.map((img) => img.url),
      currentPrice: currentPriceiInCents,
      oldPrice: oldPriceiInCents,
    };
  });
}
