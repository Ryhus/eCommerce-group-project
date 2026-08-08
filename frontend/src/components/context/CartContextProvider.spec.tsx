import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  addCartItem,
  applyDiscountCode,
  clearCart,
  deleteCartItem,
  getCart,
  removeDiscountCode,
  updateCartItem,
} from "../../services/cartService/cartService";
import type { CartResponse } from "../../services/cartService/types";
import { CartDataProvider } from "./CartContextProvider";
import { useCart } from "./useCart";

vi.mock("../../services/cartService/cartService", () => ({
  addCartItem: vi.fn(),
  applyDiscountCode: vi.fn(),
  clearCart: vi.fn(),
  deleteCartItem: vi.fn(),
  getCart: vi.fn(),
  removeDiscountCode: vi.fn(),
  updateCartItem: vi.fn(),
}));

const emptyCart: CartResponse = {
  id: "cart-id",
  items: [],
  totalQuantity: 0,
  subtotal: { amount: 0, currency: "EUR" },
  discount: { amount: 0, currency: "EUR" },
  total: { amount: 0, currency: "EUR" },
  discountCode: null,
};

function CartProbe() {
  const { addToCart, calculateTotalQuantity, cartError, isCartLoading, removePromoCode, updateCartQuantity } =
    useCart();
  return (
    <>
      <output aria-label="Cart quantity">{calculateTotalQuantity()}</output>
      <output aria-label="Cart loading">{String(isCartLoading)}</output>
      {cartError && <p role="alert">{cartError}</p>}
      <button onClick={() => void addToCart("product-id", 3)} type="button">
        Add three
      </button>
      <button onClick={() => void updateCartQuantity("item-id", 2)} type="button">
        Set two
      </button>
      <button onClick={() => void removePromoCode()} type="button">
        Remove promo
      </button>
    </>
  );
}

describe("CartDataProvider", () => {
  beforeEach(() => {
    vi.mocked(getCart).mockReset();
    vi.mocked(addCartItem).mockReset();
    vi.mocked(applyDiscountCode).mockReset();
    vi.mocked(clearCart).mockReset();
    vi.mocked(deleteCartItem).mockReset();
    vi.mocked(removeDiscountCode).mockReset();
    vi.mocked(updateCartItem).mockReset();
    vi.mocked(getCart).mockResolvedValue(emptyCart);
  });

  it("adds the selected product quantity and stores the returned cart", async () => {
    const updatedCart = { ...emptyCart, totalQuantity: 3 };
    vi.mocked(addCartItem).mockResolvedValue(updatedCart);

    render(
      <CartDataProvider>
        <CartProbe />
      </CartDataProvider>
    );

    await waitFor(() => expect(getCart).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Add three" }));

    await waitFor(() => expect(addCartItem).toHaveBeenCalledWith("product-id", 3));
    expect(screen.getByRole("status", { name: "Cart quantity" })).toHaveTextContent("3");
  });

  it("updates an item and removes a discount through explicit operations", async () => {
    vi.mocked(updateCartItem).mockResolvedValue(emptyCart);
    vi.mocked(removeDiscountCode).mockResolvedValue(emptyCart);

    render(
      <CartDataProvider>
        <CartProbe />
      </CartDataProvider>
    );

    await waitFor(() => expect(getCart).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Set two" }));
    await waitFor(() => expect(updateCartItem).toHaveBeenCalledWith("item-id", 2));

    fireEvent.click(screen.getByRole("button", { name: "Remove promo" }));
    await waitFor(() => expect(removeDiscountCode).toHaveBeenCalledOnce());
  });

  it("exposes an initial cart loading failure", async () => {
    vi.mocked(getCart).mockRejectedValueOnce(new Error("Cart unavailable"));

    render(
      <CartDataProvider>
        <CartProbe />
      </CartDataProvider>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Cart unavailable");
    expect(screen.getByRole("status", { name: "Cart loading" })).toHaveTextContent("false");
  });
});
