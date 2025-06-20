import { apiClient } from "../apiClient";
import type { Category } from "./types";

const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

//fetch category by slag.
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

//Fetch child categories by parentId, if parentId is null fetch catalog root children
// GET /<PROJECT_KEY>/categories?where=<parent(id="${parentId}")>&limit=20
export async function fetchChildCategories(parentId: string | null): Promise<Category[]> {
  const whereClause = parentId ? `parent(id="${parentId}")` : `parent is not defined`;

  const response = await apiClient.get<{
    results: Array<{
      id: string;
      name: { en: string };
      slug: { en: string };
      parent?: { id: string };
    }>;
  }>(`/${PROJECT_KEY}/categories`, {
    params: { where: whereClause, limit: 20 },
  });

  const mapped = response.data.results.map((cat) => ({
    id: cat.id,
    name: cat.name?.en ?? "",
    slug: cat.slug?.en ?? "",
    parentId: cat.parent?.id ?? null,
  }));

  return mapped.filter((c) => c.name.trim().length > 0 && c.slug.trim().length > 0);
}
