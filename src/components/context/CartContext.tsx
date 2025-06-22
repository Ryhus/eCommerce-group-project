import { createContext } from "react";

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

export const CartContext = createContext<CartContextType | null>(null);

// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartDataProvider");
//   }
//   return context;
// };
