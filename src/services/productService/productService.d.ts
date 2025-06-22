import type { Product } from "./types.ts";
export declare function fetchProductByKey(productKey: string): Promise<Product | null>;
export declare function fetchProductById(productId: string): Promise<Product | null>;
export declare function fetchProducts(sort: string | undefined, offset?: number, limit?: number): Promise<Product[]>;
export declare function fetchProductsByCategory(
  categoryId: string,
  sort: string | undefined,
  offset?: number,
  limit?: number
): Promise<Product[]>;
