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

export interface CatalogFilterOption {
  value: string;
  count: number;
}

export interface CatalogFilters {
  price: { min: number; max: number };
  colors: CatalogFilterOption[];
  sizes: CatalogFilterOption[];
  equipmentTypes: CatalogFilterOption[];
}

export interface ProductFilterState {
  minPrice?: number;
  maxPrice?: number;
  colors: string[];
  sizes: string[];
  equipmentTypes: string[];
}
