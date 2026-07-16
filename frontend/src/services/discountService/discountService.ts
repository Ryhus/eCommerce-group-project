import { apiClient } from "../apiClient";
import type { DiscountCode, DiscountCodePagedQueryResponse } from "./types";

export async function getDiscountCodes(): Promise<DiscountCodePagedQueryResponse> {
  const results = (await apiClient.get<DiscountCode[]>("/promotions/public")).data;
  return { results };
}
