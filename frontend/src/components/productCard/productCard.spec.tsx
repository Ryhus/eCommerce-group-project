import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../i18n/i18n";
import { useCart } from "../context/useCart";

import ProductCard from "./productCard";

vi.mock("../context/useCart", () => ({ useCart: vi.fn() }));

const addToCart = vi.fn();

describe("ProductCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    vi.mocked(useCart).mockReturnValue({ cart: null, addToCart } as unknown as ReturnType<typeof useCart>);
    addToCart.mockReset();
  });

  it("provides an accessible product link and a separate cart action", () => {
    render(
      <MemoryRouter>
        <ProductCard
          currentPrice={7999}
          description="Lightweight neutral running shoes."
          id="product-id"
          imgUrl="/running-shoes.jpg"
          name="Everyday Running Shoes"
          oldPrice={9999}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "View Everyday Running Shoes" })).toHaveAttribute(
      "href",
      "/product/product-id"
    );
    expect(screen.getByText("€79.99")).toBeInTheDocument();
    expect(screen.getByText("-20%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
    expect(addToCart).toHaveBeenCalledWith("product-id");
  });

  it("uses the compact showcase presentation without a cart action", () => {
    render(
      <MemoryRouter>
        <ProductCard
          currentPrice={2999}
          description="A long product description"
          id="showcase-id"
          imgUrl="/mat.jpg"
          name="Everyday Yoga Mat"
          oldPrice={2999}
          variant="showcase"
        />
      </MemoryRouter>
    );

    expect(screen.queryByText("A long product description")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add to Cart" })).not.toBeInTheDocument();
  });

  it("localizes actions and currency presentation", async () => {
    await i18n.changeLanguage("de");

    const { container } = render(
      <MemoryRouter>
        <ProductCard
          currentPrice={7999}
          id="product-id"
          imgUrl="/running-shoes.jpg"
          name="Everyday Running Shoes"
          oldPrice={9999}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Everyday Running Shoes ansehen" })).toHaveAttribute(
      "href",
      "/product/product-id"
    );
    expect(container.querySelector(".product-card__current-price")?.textContent).toBe("79,99 €");
    expect(screen.getByRole("button", { name: "In den Warenkorb" })).toBeVisible();
  });
});
