import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { CartResponse } from "../../../services/cartService/types";
import { useCart } from "../../context/useCart";
import { BasketProductList } from "./BasketProductList";

vi.mock("../../context/useCart", () => ({ useCart: vi.fn() }));
vi.mock("../BasketProductCard/BasketProductCard", () => ({
  BasketProductCard: ({ item }: { item: { name: string } }) => <article>{item.name}</article>,
}));

const cart: CartResponse = {
  id: "cart-id",
  items: [
    {
      id: "item-1",
      productId: "product-1",
      variantId: "variant-1",
      name: "Match Football",
      image: null,
      quantity: 1,
      unitPrice: { amount: 3499, currency: "EUR" },
      lineTotal: { amount: 3499, currency: "EUR" },
    },
  ],
  totalQuantity: 1,
  subtotal: { amount: 3499, currency: "EUR" },
  discount: { amount: 0, currency: "EUR" },
  total: { amount: 3499, currency: "EUR" },
  discountCode: null,
};

describe("BasketProductList", () => {
  it("renders cart items as a semantic list", () => {
    vi.mocked(useCart).mockReturnValue({ cart } as never);
    render(
      <MemoryRouter>
        <BasketProductList />
      </MemoryRouter>
    );

    expect(screen.getByRole("region", { name: "Cart items" })).toBeVisible();
    expect(screen.getByRole("listitem")).toHaveTextContent("Match Football");
  });

  it("offers a clear catalog action for an empty cart", () => {
    vi.mocked(useCart).mockReturnValue({ cart: { ...cart, items: [], totalQuantity: 0 } } as never);
    render(
      <MemoryRouter>
        <BasketProductList />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Browse products" })).toHaveAttribute("href", "/catalog");
  });
});
