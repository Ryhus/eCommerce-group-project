export interface Product {
  id: string;
  name: string;
  slug: string;
  imgUrls: string[];
  currentPrice: number; //in centes
  oldPrice: number; //in centes
}

// export interface Product {
// 	id: string;
// 	name: string;
// 	slug: string;
// 	imgUrls: string[];
// 	currentPrice: number;
// 	oldPrice: number;
// 	priceFormatted?: string; // (optional)
//   }
