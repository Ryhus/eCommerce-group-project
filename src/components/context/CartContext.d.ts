import type { CartResponse } from "../../services/cartService/types";
export interface CartContextType {
  cart: CartResponse | null;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string, quantity?: number) => Promise<void>;
  calculateTotalQuantity: () => number;
  applyPromoCode: (promoCode: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setNewCart: (cart: CartResponse | null) => void;
}
export declare const CartContext: import("react").Context<CartContextType | null>;
