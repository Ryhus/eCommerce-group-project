import { apiClient } from "../apiClient";
import type { UpdateCartActions, CartDraft, CartResponse } from "./types";
import { TokenService } from "../TokenService";

const API_URL = import.meta.env.VITE_CTP_API_URL;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

export async function createCart(payload: CartDraft) {
  const response = await apiClient.post<CartResponse>(`${API_URL}/${PROJECT_KEY}/carts`, payload);
  const cartData = response.data;

  return cartData;
}

export async function getCart(cartId: string) {
  const response = await apiClient.get<CartResponse>(`${API_URL}/${PROJECT_KEY}/carts/${cartId}`);
  const cartData = response.data;

  return cartData;
}

export async function updateCart(cartId: string, cartVersion: string, ...actions: UpdateCartActions) {
  const payload = {
    version: Number(cartVersion),
    actions: actions,
  };
  const response = await apiClient.post<CartResponse>(`${API_URL}/${PROJECT_KEY}/carts/${cartId}`, payload);
  const cartData = response.data;
  TokenService.setCartVersion(cartData.version.toString());
  return cartData;
}

export async function deleteCart(cartId: string, version: number) {
  const response = await apiClient.delete<CartResponse>(
    `${API_URL}/${PROJECT_KEY}/carts/${cartId}/?version=${version}`
  );
  const cartData = response.data;

  return cartData;
}
