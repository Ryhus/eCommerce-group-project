export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface DiscountCodePagedQueryResponse {
  results: DiscountCode[];
}
