import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchChildCategories } from "../../services/categoryService/categoryService";
import { fetchProductPage } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import CategoryPage from "./Category";

vi.mock("../../services/categoryService/categoryService", () => ({
  fetchCategoryBySlug: vi.fn(),
  fetchChildCategories: vi.fn(),
}));

vi.mock("../../services/productService/productService", () => ({
  fetchProductPage: vi.fn(),
}));

vi.mock("../../components/productList/ProductList", () => ({
  default: ({ products }: { products: Product[] }) => (
    <ul aria-label="Products">
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
    description: "Catalog product",
    imgUrls: [`product-${index}.jpg`],
    currentPrice: 1000 + index,
    oldPrice: 1200 + index,
  };
}

function renderCatalog(initialEntry = "/catalog") {
  const router = createMemoryRouter([{ path: "/catalog/*", element: <CategoryPage /> }], {
    initialEntries: [initialEntry],
  });
  render(<RouterProvider router={router} />);
  return router;
}

describe("CategoryPage", () => {
  beforeEach(() => {
    vi.mocked(fetchChildCategories).mockReset();
    vi.mocked(fetchProductPage).mockReset();
    vi.mocked(fetchChildCategories).mockResolvedValue([{ id: "balls", name: "Balls", slug: "balls", parentId: null }]);
    vi.mocked(fetchProductPage).mockImplementation(async ({ offset = 0, limit = 6 }) => ({
      items: Array.from({ length: offset ? 2 : 6 }, (_, index) => product(offset + index + 1)),
      offset,
      limit,
      total: 8,
    }));
  });

  it("loads server pages and reports the visible product range", async () => {
    renderCatalog();

    expect(await screen.findByText("Showing 1-6 of 8 products")).toBeVisible();
    expect(fetchProductPage).toHaveBeenCalledWith(expect.objectContaining({ limit: 6, offset: 0 }));

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(await screen.findByText("Showing 7-8 of 8 products")).toBeVisible();
    expect(fetchProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 6, offset: 6 }));
  });

  it("stores sorting in the URL and exposes categories in the mobile drawer", async () => {
    const router = renderCatalog();

    await screen.findByText("Showing 1-6 of 8 products");
    fireEvent.change(screen.getByRole("combobox", { name: "Sort products" }), {
      target: { value: "price desc" },
    });

    await waitFor(() => expect(router.state.location.search).toContain("sort=price+desc"));
    expect(fetchProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "price desc" }));

    fireEvent.click(screen.getByRole("button", { name: "Open catalog options" }));

    expect(screen.getByRole("dialog", { name: "Catalog options" })).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Balls" })).toHaveLength(2);
  });
});
