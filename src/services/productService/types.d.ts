export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imgUrls: string[];
    currentPrice: number;
    oldPrice: number;
}
