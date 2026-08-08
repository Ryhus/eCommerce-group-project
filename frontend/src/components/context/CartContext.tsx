import { createContext } from "react";
import type { CartResponse } from "../../services/cartService/types";

export interface CartContextType {
  cart: CartResponse | null;
  cartError: string | null;
  isCartLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  calculateTotalQuantity: () => number;
  applyPromoCode: (promoCode: string) => Promise<void>;
  removePromoCode: () => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  setNewCart: (cart: CartResponse | null) => void;
}

export const CartContext = createContext<CartContextType | null>(null);
