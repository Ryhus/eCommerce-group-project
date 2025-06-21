interface DiscountCode {
  id: string;
  version: number;
  code: string;
  groups: string[];
  createdAt: Date;
  lastModifiedAt: Date;
  key?: string;
  cartPredicate?: string;
  isActive?: boolean;
  maxApplications?: number;
  maxApplicationsPerCustomer?: number;
  validFrom?: Date;
  validUntil?: Date;
  applicationVersion?: number;
  description: { en: string };
}

export interface DiscountCodePagedQueryResponse {
  limit: number;
  offset: number;
  count: number;
  results: DiscountCode[];
  total?: number;
}
