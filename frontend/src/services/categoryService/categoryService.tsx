import { apiClient } from "../apiClient";
import type { Category } from "./types";

let categoryCache: Category[] | null = null;

async function categories() {
  if (!categoryCache) categoryCache = (await apiClient.get<Category[]>("/catalog/categories")).data;
  return categoryCache;
}

function flatten(items: Category[]): Category[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}

export async function fetchCategoryBySlug(slug: string, parentId?: string | null): Promise<Category | null> {
  const all = flatten(await categories());
  return all.find((category) => category.slug === slug && category.parentId === (parentId ?? null)) ?? null;
}

export async function fetchChildCategories(parentId: string | null): Promise<Category[]> {
  return flatten(await categories()).filter((category) => category.parentId === parentId);
}
