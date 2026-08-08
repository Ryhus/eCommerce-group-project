import { useCallback, useEffect, useState } from "react";

import {
  addCartItem,
  applyDiscountCode,
  clearCart as clearCartRequest,
  deleteCartItem,
  getCart,
  removeDiscountCode,
  updateCartItem,
} from "../../services/cartService/cartService";
import type { CartResponse } from "../../services/cartService/types";
import { CartContext } from "./CartContext";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to update the cart";
}

export function CartDataProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    setIsCartLoading(true);
    setCartError(null);
    try {
      setCart(await getCart());
    } catch (error) {
      setCartError(errorMessage(error));
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const updateCart = async (request: () => Promise<CartResponse>) => {
    setCartError(null);
    try {
      setCart(await request());
    } catch (error) {
      setCartError(errorMessage(error));
      throw error;
    }
  };

  const addToCart = async (productId: string, quantity = 1) => updateCart(() => addCartItem(productId, quantity));

  const removeFromCart = async (productId: string, quantity?: number) => {
    if (!cart) throw new Error("Cart not initialized");
    const item = cart.items.find((cartItem) => cartItem.productId === productId);
    if (!item) return;
    if (quantity && item.quantity > quantity) await updateCart(() => updateCartItem(item.id, item.quantity - quantity));
    else await updateCart(() => deleteCartItem(item.id));
  };

  const updateCartQuantity = async (itemId: string, quantity: number) =>
    updateCart(() => updateCartItem(itemId, quantity));
  const removeCartItem = async (itemId: string) => updateCart(() => deleteCartItem(itemId));
  const applyPromoCode = async (promoCode: string) => updateCart(() => applyDiscountCode(promoCode));
  const removePromoCode = async () => updateCart(removeDiscountCode);
  const clearCart = async () => updateCart(clearCartRequest);
  const setNewCart = (nextCart: CartResponse | null) => {
    setCart(nextCart);
    setCartError(null);
    setIsCartLoading(false);
  };

  return (
    <CartContext
      value={{
        cart,
        cartError,
        isCartLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        removeCartItem,
        calculateTotalQuantity: () => cart?.totalQuantity ?? 0,
        applyPromoCode,
        removePromoCode,
        clearCart,
        refreshCart,
        setNewCart,
      }}
    >
      {children}
    </CartContext>
  );
}
