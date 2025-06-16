import { apiClient } from "../apiClient";
import type { UpdateCartActions, CartDraft } from "./types";

const API_URL = import.meta.env.VITE_CTP_API_URL;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

export async function createCart(payload: CartDraft) {
  const response = await apiClient.post(`${API_URL}/${PROJECT_KEY}/carts`, payload);
  const cartData = response.data;

  return cartData;
}

export async function getCart(cartId: string) {
  const response = await apiClient.get(`${API_URL}/${PROJECT_KEY}/carts/${cartId}`);
  const cartData = response.data;

  return cartData;
}

export async function updateCart(cartId: string, cartVersion: string, ...actions: UpdateCartActions) {
  console.log(cartId);
  console.log(cartVersion);
  console.log(actions);
  // const payload = {
  //   version: cartVersion
  //   actions:
  // }
  // const response = await apiClient.post(`${API_URL}/${PROJECT_KEY}/carts/${cartId}`);
}
