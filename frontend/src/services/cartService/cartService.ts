import { apiClient } from "../apiClient";
import type { CartResponse } from "./types";

export async function getCart() {
  return (await apiClient.get<CartResponse>("/cart")).data;
}

export async function addCartItem(productId: string, quantity = 1) {
  return (await apiClient.post<CartResponse>("/cart/items", { productId, quantity })).data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  return (await apiClient.patch<CartResponse>(`/cart/items/${itemId}`, { quantity })).data;
}

export async function deleteCartItem(itemId: string) {
  return (await apiClient.delete<CartResponse>(`/cart/items/${itemId}`)).data;
}

export async function clearCart() {
  return (await apiClient.delete<CartResponse>("/cart/items")).data;
}

export async function applyDiscountCode(code: string) {
  return (await apiClient.put<CartResponse>("/cart/discount-code", { code })).data;
}

export async function removeDiscountCode() {
  return (await apiClient.delete<CartResponse>("/cart/discount-code")).data;
}
