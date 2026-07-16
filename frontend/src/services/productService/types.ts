export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imgUrls: string[];
  currentPrice: number; //in centes
  oldPrice: number; //in centes
}
