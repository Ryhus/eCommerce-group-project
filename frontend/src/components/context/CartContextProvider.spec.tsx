import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  addCartItem,
  applyDiscountCode,
  clearCart,
  deleteCartItem,
  getCart,
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
  const { addToCart, calculateTotalQuantity } = useCart();
  return (
    <>
      <output aria-label="Cart quantity">{calculateTotalQuantity()}</output>
      <button onClick={() => void addToCart("product-id", 3)} type="button">
        Add three
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
});
