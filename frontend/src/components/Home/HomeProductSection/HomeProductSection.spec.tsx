import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { Product } from "../../../services/productService/types";

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
    currentPrice: 7999,
    oldPrice: 9999,
  },
];

describe("HomeProductSection", () => {
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
});
