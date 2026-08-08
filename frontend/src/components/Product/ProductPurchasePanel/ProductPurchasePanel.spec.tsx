import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";
import type { Product } from "../../../services/productService/types";
import { useCart } from "../../context/useCart";
import { ProductPurchasePanel } from "./ProductPurchasePanel";

vi.mock("../../context/useCart", () => ({ useCart: vi.fn() }));

const product: Product = {
  id: "product-id",
  slug: "match-football",
  name: "Match Football",
  description: "Competition-ready football.",
  imgUrls: ["football.jpg"],
  categoryIds: ["football-id"],
  currentPrice: 3499,
  oldPrice: 4499,
};

describe("ProductPurchasePanel", () => {
  const addToCart = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage("en");
    addToCart.mockReset();
    addToCart.mockResolvedValue(undefined);
    vi.mocked(useCart).mockReturnValue({ addToCart } as never);
  });

  it("presents product pricing and adds the selected quantity", async () => {
    render(<ProductPurchasePanel product={product} />);

    expect(screen.getByRole("heading", { name: "Match Football" })).toBeVisible();
    expect(screen.getByLabelText("Product price")).toHaveTextContent("€34.99");
    expect(screen.getByLabelText("Product price")).toHaveTextContent("-22%");

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));

    await waitFor(() => expect(addToCart).toHaveBeenCalledWith("product-id", 2));
    expect(await screen.findByText("2 × Match Football added to your cart.")).toBeVisible();
  });

  it("reports a cart failure without losing the selected quantity", async () => {
    addToCart.mockRejectedValueOnce(new Error("Unavailable"));
    render(<ProductPurchasePanel product={product} />);

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't add this product");
    expect(screen.getByRole("status", { name: "Quantity" })).toHaveTextContent("2");
  });

  it("localizes prices, actions, and successful feedback", async () => {
    await i18n.changeLanguage("de");
    render(<ProductPurchasePanel product={product} />);

    expect(screen.getByLabelText("Produktpreis")).toHaveTextContent("34,99 €");
    expect(screen.getByLabelText("Vorheriger Preis 44,99 €")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Menge erhöhen" }));
    fireEvent.click(screen.getByRole("button", { name: "In den Warenkorb" }));

    expect(await screen.findByText("2 × Match Football zum Warenkorb hinzugefügt.")).toBeVisible();
  });
});
