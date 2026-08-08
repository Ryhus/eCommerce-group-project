import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, MemoryRouter, Outlet, Route, RouterProvider, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../i18n/i18n";
import { fetchCategoryBySlug, fetchChildCategories } from "../../services/categoryService/categoryService";
import { fetchProductPage } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import NotFoundPage from "../NotFound/NotFound";
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
    categoryIds: ["category-id"],
    currentPrice: 1000 + index,
    oldPrice: 1200 + index,
  };
}

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Location search">{location.search}</output>;
}

function renderCatalog(initialEntry = "/catalog") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          element={
            <>
              <CategoryPage />
              <LocationProbe />
            </>
          }
          path="/catalog/*"
        />
      </Routes>
    </MemoryRouter>
  );
}

function renderCatalogWithRouteErrorBoundary(initialEntry = "/catalog/missing-category") {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <>
            <header>Store header</header>
            <Outlet />
            <footer>Store footer</footer>
          </>
        ),
        errorElement: <NotFoundPage />,
        children: [{ path: "catalog/*", Component: CategoryPage }],
      },
    ],
    { initialEntries: [initialEntry] }
  );

  render(<RouterProvider router={router} />);
}

describe("CategoryPage", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    vi.mocked(fetchChildCategories).mockReset();
    vi.mocked(fetchCategoryBySlug).mockReset();
    vi.mocked(fetchProductPage).mockReset();
    vi.mocked(fetchChildCategories).mockResolvedValue([{ id: "balls", name: "Balls", slug: "balls", parentId: null }]);
    vi.mocked(fetchProductPage).mockImplementation(async (query = {}) => {
      const { offset = 0, limit = 6 } = query;
      return {
        items: Array.from({ length: offset ? 2 : 6 }, (_, index) => product(offset + index + 1)),
        offset,
        limit,
        total: 8,
      };
    });
  });

  it("loads server pages and reports the visible product range", async () => {
    renderCatalog();

    expect(await screen.findByText("Showing 1-6 of 8 products")).toBeVisible();
    expect(fetchProductPage).toHaveBeenCalledWith(expect.objectContaining({ limit: 6, offset: 0 }));

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(await screen.findByText("Showing 7-8 of 8 products")).toBeVisible();
    expect(fetchProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 6, offset: 6 }));
  });

  it("hides results from the previous URL while the next page is loading", async () => {
    let resolveNextPage!: (page: Awaited<ReturnType<typeof fetchProductPage>>) => void;
    const nextPage = new Promise<Awaited<ReturnType<typeof fetchProductPage>>>((resolve) => {
      resolveNextPage = resolve;
    });

    vi.mocked(fetchProductPage)
      .mockResolvedValueOnce({ items: [product(1)], offset: 0, limit: 6, total: 8 })
      .mockReturnValueOnce(nextPage);

    renderCatalog();
    expect(await screen.findByText("Product 1")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("status", { name: "Catalog loading" })).toBeVisible();
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();

    resolveNextPage({ items: [product(7)], offset: 6, limit: 6, total: 8 });
    expect(await screen.findByText("Product 7")).toBeVisible();
  });

  it("stores sorting in the URL and exposes categories in the mobile drawer", async () => {
    renderCatalog();

    await screen.findByText("Showing 1-6 of 8 products");
    fireEvent.change(screen.getByRole("combobox", { name: "Sort products" }), {
      target: { value: "price desc" },
    });

    await waitFor(() =>
      expect(screen.getByRole("status", { name: "Location search" })).toHaveTextContent("sort=price+desc")
    );
    expect(fetchProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "price desc" }));

    fireEvent.click(screen.getByRole("button", { name: "Open catalog options" }));

    expect(screen.getByRole("dialog", { name: "Catalog options" })).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Balls" })).toHaveLength(2);
  });

  it("localizes catalog summaries and controls", async () => {
    await i18n.changeLanguage("ru");
    renderCatalog();

    expect(await screen.findByText("Показано 1-6 из 8 товаров")).toBeVisible();
    expect(screen.getByRole("heading", { level: 1, name: "Все товары" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Сортировка товаров" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Открыть параметры каталога" })).toBeVisible();
  });

  it("updates an existing load error when the language changes", async () => {
    vi.mocked(fetchProductPage).mockRejectedValue(new Error("Unavailable"));
    renderCatalog();

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load the catalog");

    await act(async () => {
      await i18n.changeLanguage("de");
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Der Katalog konnte nicht geladen werden");
    expect(screen.getByRole("button", { name: "Erneut versuchen" })).toBeVisible();
    expect(fetchProductPage).toHaveBeenCalledTimes(1);
  });

  it("renders an unknown category through the standalone route error page", async () => {
    vi.mocked(fetchCategoryBySlug).mockResolvedValue(null);
    renderCatalogWithRouteErrorBoundary();

    expect(await screen.findByRole("heading", { name: "This page doesn't exist" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Browse gear" })).toBeVisible();
    expect(screen.queryByText("Store header")).not.toBeInTheDocument();
    expect(screen.queryByText("Store footer")).not.toBeInTheDocument();
    expect(fetchChildCategories).not.toHaveBeenCalled();
  });
});
