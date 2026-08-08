export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imgUrls: string[];
  categoryIds: string[];
  currentPrice: number; // in cents
  oldPrice: number; // in cents
}

export interface ProductPage {
  items: Product[];
  offset: number;
  limit: number;
  total: number;
}
