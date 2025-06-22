import type { UpdateCartActions, CartDraft, CartResponse } from "./types";
export declare function createCart(payload: CartDraft): Promise<CartResponse>;
export declare function getCart(cartId: string): Promise<CartResponse>;
export declare function updateCart(
  cartId: string,
  cartVersion: string,
  ...actions: UpdateCartActions
): Promise<CartResponse>;
export declare function deleteCart(cartId: string, version: number): Promise<CartResponse>;
