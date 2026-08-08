import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Product } from "../../../services/productService/types";
import i18n from "../../../i18n/i18n";

import HomeProductSection from "./HomeProductSection";

vi.mock("../../productList/ProductList", () => ({
  default: ({ products, variant }: { products: Product[]; variant: string }) => (
    <div data-testid="product-list" data-variant={variant}>
      {products.map((product) => product.name).join(", ")}
    </div>
  ),
}));

const products: Product[] = [
  {
    id: "one",
    slug: "running-shoes",
    name: "Running Shoes",
    imgUrls: ["/shoes.jpg"],
    categoryIds: ["shoes"],
    currentPrice: 7999,
    oldPrice: 9999,
  },
];

describe("HomeProductSection", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("labels the section and presents showcase products with a catalog link", () => {
    render(
      <MemoryRouter>
        <HomeProductSection products={products} title="New arrivals" />
      </MemoryRouter>
    );

    expect(screen.getByRole("region", { name: "New arrivals" })).toBeInTheDocument();
    expect(screen.getByTestId("product-list")).toHaveAttribute("data-variant", "showcase");
    expect(screen.getByText("Running Shoes")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all" })).toHaveAttribute("href", "/catalog");
  });

  it("localizes the catalog action", async () => {
    await i18n.changeLanguage("de");

    render(
      <MemoryRouter>
        <HomeProductSection products={products} title="Neu eingetroffen" />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Alle ansehen" })).toHaveAttribute("href", "/catalog");
  });
});
