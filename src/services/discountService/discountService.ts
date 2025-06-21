import { apiClient } from "../apiClient";

import type { DiscountCodePagedQueryResponse } from "./types";

const API_URL = import.meta.env.VITE_CTP_API_URL;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

export async function getDiscountCodes() {
  const response = await apiClient.get<DiscountCodePagedQueryResponse>(`${API_URL}/${PROJECT_KEY}/discount-codes`);
  const cartData = response.data;

  return cartData;
}
