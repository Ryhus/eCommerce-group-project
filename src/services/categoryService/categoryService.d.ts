import type { Category } from "./types";
export declare function fetchCategoryBySlug(slug: string, parentId?: string | null): Promise<Category | null>;
export declare function fetchChildCategories(parentId: string | null): Promise<Category[]>;
