// src/services/categoryService.ts
import { apiClient } from "../apiClient";
import type { Category } from "./types";

const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

// Fetch parent category up to 20 levels
// GET /<PROJECT_KEY>/categories?where=parent is null&limit=20
export async function fetchTopLevelCategories(): Promise<Category[]> {
  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      slug: { en: string };
      parent?: { id: string };
    }>;
  }>(`/${PROJECT_KEY}/categories`, {
    params: { where: "parent is not defined", limit: 20 },
  });

  return response.data.results.map((cat) => ({
    id: cat.id,
    name: cat.name.en,
    slug: cat.slug.en,
    parentId: cat.parent?.id ?? null,
  }));
}

//fetch category by slag. A Slug is the unique identifying part of a web address, typically at the end of the URL
// GET /<PROJECT_KEY>/categories?where=<whereClause>&limit=1
export async function fetchCategoryBySlug(slug: string, parentId?: string | null): Promise<Category | null> {
  const whereClause = parentId ? `slug(en="${slug}") and parent(id="${parentId}")` : `slug(en="${slug}")`;

  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      slug: { en: string };
      parent?: { id: string };
    }>;
  }>(`/${PROJECT_KEY}/categories`, {
    params: { where: whereClause, limit: 1 },
  });

  if (!response.data.results.length) return null;

  const c = response.data.results[0];
  return {
    id: c.id,
    name: c.name.en,
    slug: c.slug.en,
    parentId: c.parent?.id ?? null,
  };
}
