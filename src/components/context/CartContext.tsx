import { createContext, useState, useEffect, useContext } from "react";
import { getCart, updateCart } from "../../services/cartService/cartService";
import { TokenService } from "../../services/TokenService";
import type { CartResponse } from "../../services/cartService/types";

interface CartContextType {
  cart: CartResponse | null;
  addToCart?: (productId: string) => Promise<void>;
  removeFromCart?: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartDataProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartResponse | null>(null);

  const fetchCart = async () => {
    const cartId = TokenService.getCartId() as string;
    const cartData = await getCart(cartId);
    setCart(cartData);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: string) => {
    console.log(cart);
    if (!cart) throw new Error("Cart not initialized");
    const cartId = TokenService.getCartId() as string;
    const updatedCart = await updateCart(cartId, cart.version.toString(), {
      action: "addLineItem",
      productId,
    });
    setCart(updatedCart);
  };

  const removeFromCart = async (productId: string) => {
    console.log(cart);
    if (!cart) throw new Error("Cart not initialized");
    const cartId = TokenService.getCartId() as string;
    const itemToRemove = cart.lineItems.find((item) => item.productId === productId);
    if (itemToRemove) {
      const updatedCart = await updateCart(cartId, cart.version.toString(), {
        action: "removeLineItem",
        lineItemId: itemToRemove.id,
      });
      setCart(updatedCart);
    }
  };

  return <CartContext value={{ cart, addToCart, removeFromCart }}>{children}</CartContext>;
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartDataProvider");
  }
  return context;
};
