import { useCallback, useEffect, useState } from "react";
import {
  addCartItem,
  applyDiscountCode,
  clearCart as clearCartRequest,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../../services/cartService/cartService";
import type { CartResponse } from "../../services/cartService/types";
import { CartContext } from "./CartContext";

export function CartDataProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);

  const refreshCart = useCallback(async () => {
    setCart(await getCart());
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => setCart(await addCartItem(productId, quantity));

  const removeFromCart = async (productId: string, quantity?: number) => {
    if (!cart) throw new Error("Cart not initialized");
    const item = cart.items.find((cartItem) => cartItem.productId === productId);
    if (!item) return;
    if (quantity && item.quantity > quantity) setCart(await updateCartItem(item.id, item.quantity - quantity));
    else setCart(await deleteCartItem(item.id));
  };

  const applyPromoCode = async (promoCode: string) => setCart(await applyDiscountCode(promoCode));
  const clearCart = async () => setCart(await clearCartRequest());

  return (
    <CartContext
      value={{
        cart,
        addToCart,
        removeFromCart,
        calculateTotalQuantity: () => cart?.totalQuantity ?? 0,
        applyPromoCode,
        clearCart,
        refreshCart,
        setNewCart: setCart,
      }}
    >
      {children}
    </CartContext>
  );
}
