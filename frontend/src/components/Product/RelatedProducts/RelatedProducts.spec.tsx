import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";
import type { Product } from "../../../services/productService/types";
import { RelatedProducts } from "./RelatedProducts";

vi.mock("../../productList/ProductList", () => ({
  default: ({ products, variant }: { products: Product[]; variant: string }) => (
    <ul aria-label="Recommendations" data-variant={variant}>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  ),
}));

function product(index: number): Product {
  return {
    id: `product-${index}`,
    slug: `product-${index}`,
    name: `Product ${index}`,
    imgUrls: [],
    categoryIds: ["category-id"],
    currentPrice: 1000,
    oldPrice: 1000,
  };
}

describe("RelatedProducts", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("excludes the current product and limits the storefront row to four items", () => {
    render(
      <RelatedProducts currentProductId="product-1" products={Array.from({ length: 6 }, (_, i) => product(i + 1))} />
    );

    expect(screen.getByRole("heading", { name: "You might also like" })).toBeVisible();
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByRole("list", { name: "Recommendations" })).toHaveAttribute("data-variant", "showcase");
  });

  it("does not render an empty recommendations section", () => {
    const { container } = render(<RelatedProducts currentProductId="product-1" products={[product(1)]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("localizes the recommendations heading", async () => {
    await i18n.changeLanguage("ru");

    render(<RelatedProducts currentProductId="product-1" products={[product(1), product(2)]} />);

    expect(screen.getByRole("heading", { name: "Вам также может понравиться" })).toBeVisible();
  });
});
