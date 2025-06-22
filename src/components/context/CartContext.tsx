import { createContext, useState, useEffect, useContext } from "react";
import { getCart, updateCart, deleteCart, createCart } from "../../services/cartService/cartService";
import { TokenService } from "../../services/TokenService";
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

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartDataProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartResponse | null>(null);

  const setNewCart = function (cart: CartResponse | null) {
    setCart(cart);
  };

  const fetchCart = async () => {
    const cartId = TokenService.getCartId() as string;
    const cartData = await getCart(cartId);
    setCart(cartData);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: string) => {
    if (!cart) throw new Error("Cart not initialized");
    const cartId = TokenService.getCartId() as string;
    const updatedCart = await updateCart(cartId, cart.version.toString(), {
      action: "addLineItem",
      productId,
    });
    setCart(updatedCart);
  };

  const removeFromCart = async (productId: string, quantity?: number) => {
    if (!cart) throw new Error("Cart not initialized");
    const cartId = TokenService.getCartId() as string;
    const itemToRemove = cart.lineItems.find((item) => item.productId === productId);
    if (itemToRemove) {
      const removeQuantity = quantity ? quantity : itemToRemove.quantity;
      const updatedCart = await updateCart(cartId, cart.version.toString(), {
        action: "removeLineItem",
        lineItemId: itemToRemove.id,
        quantity: removeQuantity,
      });
      setCart(updatedCart);
    }
  };

  const calculateTotalQuantity = () => {
    if (!cart) throw new Error("Cart not initialized");
    const { lineItems } = cart;

    let totalCartQuantity = 0;
    lineItems.forEach((lineItem) => {
      const { quantity } = lineItem;
      if (quantity) {
        totalCartQuantity += quantity;
      }
    });
    return totalCartQuantity;
  };

  const applyPromoCode = async (promoCode: string) => {
    if (!cart) throw new Error("Cart not initialized");
    const cartId = TokenService.getCartId() as string;
    const updatedCart = await updateCart(cartId, cart.version.toString(), {
      action: "addDiscountCode",
      code: promoCode,
    });
    setCart(updatedCart);
  };

  const clearCart = async () => {
    if (!cart) throw new Error("Cart not initialized");
    const cartId = TokenService.getCartId() as string;
    await deleteCart(cartId, cart.version);

    const anonId = TokenService.getAnonSessionId();
    const customerId = TokenService.getCustomerId();

    if (customerId) {
      const clearedCart = await createCart({ currency: "EUR", customerId: customerId });
      TokenService.setCartId(clearedCart.id);
      setCart(clearedCart);
    } else {
      const clearedCart = await createCart({ currency: "EUR", anonymousId: anonId });
      TokenService.setCartId(clearedCart.id);
      setCart(clearedCart);
    }
  };

  return (
    <CartContext
      value={{ cart, addToCart, removeFromCart, calculateTotalQuantity, applyPromoCode, clearCart, setNewCart }}
    >
      {children}
    </CartContext>
  );
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartDataProvider");
  }
  return context;
};
