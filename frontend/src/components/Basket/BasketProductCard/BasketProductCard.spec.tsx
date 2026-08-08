import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";
import type { CartItem } from "../../../services/cartService/types";
import { useCart } from "../../context/useCart";
import { BasketProductCard } from "./BasketProductCard";

vi.mock("../../context/useCart", () => ({ useCart: vi.fn() }));

const item: CartItem = {
  id: "item-id",
  productId: "product-id",
  variantId: "variant-id",
  name: "Match Football",
  image: "football.jpg",
  quantity: 2,
  unitPrice: { amount: 3499, currency: "EUR" },
  lineTotal: { amount: 6998, currency: "EUR" },
};

describe("BasketProductCard", () => {
  const updateCartQuantity = vi.fn();
  const removeCartItem = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage("en");
    updateCartQuantity.mockReset();
    removeCartItem.mockReset();
    updateCartQuantity.mockResolvedValue(undefined);
    removeCartItem.mockResolvedValue(undefined);
    vi.mocked(useCart).mockReturnValue({ updateCartQuantity, removeCartItem } as never);
  });

  it("links to the product and updates its exact cart item", async () => {
    render(
      <MemoryRouter>
        <BasketProductCard item={item} />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "View Match Football" })).toHaveAttribute("href", "/product/product-id");
    expect(screen.getByText("€69.98")).toBeVisible();
    expect(screen.getByText("€34.99 each")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    await waitFor(() => expect(updateCartQuantity).toHaveBeenCalledWith("item-id", 3));
  });

  it("removes its exact cart item", async () => {
    render(
      <MemoryRouter>
        <BasketProductCard item={item} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove Match Football from cart" }));
    await waitFor(() => expect(removeCartItem).toHaveBeenCalledWith("item-id"));
  });

  it("localizes actions and prices for the selected language", async () => {
    await i18n.changeLanguage("de");
    render(
      <MemoryRouter>
        <BasketProductCard item={item} />
      </MemoryRouter>
    );

    expect(screen.getByRole("article", { name: "Match Football im Warenkorb" })).toBeVisible();
    expect(screen.getByText("69,98 €")).toBeVisible();
    expect(screen.getByText("je 34,99 €")).toBeVisible();
    expect(screen.getByRole("button", { name: "Match Football aus dem Warenkorb entfernen" })).toBeVisible();
  });
});
