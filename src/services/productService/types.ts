export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  imgUrls: string[];
  currentPrice: number; //in centes
  oldPrice: number; //in centes
}
