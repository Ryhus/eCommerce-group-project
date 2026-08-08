import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, Link, MemoryRouter, Outlet, Route, RouterProvider, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../i18n/i18n";
import { fetchCategoryTrail } from "../../services/categoryService/categoryService";
import { fetchProductById, fetchProductPage } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import NotFoundPage from "../NotFound/NotFound";
import ProductPage from "./Product";

vi.mock("../../services/categoryService/categoryService", () => ({ fetchCategoryTrail: vi.fn() }));
vi.mock("../../services/productService/productService", () => ({
  fetchProductById: vi.fn(),
  fetchProductPage: vi.fn(),
}));
vi.mock("../../components/Product/ProductGallery/ProductGallery", () => ({
  ProductGallery: ({ productName }: { productName: string }) => <div>{productName} gallery</div>,
}));
vi.mock("../../components/Product/ProductPurchasePanel/ProductPurchasePanel", () => ({
  ProductPurchasePanel: ({ product }: { product: Product }) => <h1>{product.name}</h1>,
}));
vi.mock("../../components/Product/RelatedProducts/RelatedProducts", () => ({
  RelatedProducts: ({ products }: { products: Product[] }) => <div>{products.length} recommendations</div>,
}));

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

const secondProduct: Product = {
  ...product,
  id: "product-two",
  slug: "training-backpack",
  name: "Training Backpack",
};

function renderProduct() {
  render(
    <MemoryRouter initialEntries={["/product/product-id"]}>
      <Routes>
        <Route
          element={
            <>
              <ProductPage />
              <Link to="/product/product-two">Open product two</Link>
            </>
          }
          path="/product/:id"
        />
      </Routes>
    </MemoryRouter>
  );
}

function renderProductWithRouteErrorBoundary() {
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
        children: [{ path: "product/:id", Component: ProductPage }],
      },
    ],
    { initialEntries: ["/product/product-id"] }
  );

  render(<RouterProvider router={router} />);
}

describe("ProductPage", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    vi.mocked(fetchProductById).mockReset();
    vi.mocked(fetchCategoryTrail).mockReset();
    vi.mocked(fetchProductPage).mockReset();
    vi.mocked(fetchCategoryTrail).mockResolvedValue([
      { id: "balls-id", name: "Balls", slug: "balls", parentId: null },
      { id: "football-id", name: "Football", slug: "football", parentId: "balls-id" },
    ]);
    vi.mocked(fetchProductPage).mockResolvedValue({ items: [product], offset: 0, limit: 5, total: 1 });
  });

  it("loads the product, category breadcrumbs, and related category products", async () => {
    vi.mocked(fetchProductById).mockResolvedValue(product);
    renderProduct();

    expect(screen.getByRole("status")).toHaveTextContent("Loading product");
    expect(await screen.findByRole("heading", { name: "Match Football" })).toBeVisible();

    await waitFor(() => expect(fetchCategoryTrail).toHaveBeenCalledWith("football-id"));
    expect(fetchProductPage).toHaveBeenCalledWith({ categoryId: "balls-id", limit: 5 });
    expect(await screen.findByText("1 recommendations")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      "HomeCatalogBallsFootballMatch Football"
    );
  });

  it("hides the previous product while a new URL is loading", async () => {
    let resolveSecondProduct!: (product: Product | null) => void;
    const secondProductRequest = new Promise<Product | null>((resolve) => {
      resolveSecondProduct = resolve;
    });
    vi.mocked(fetchProductById).mockResolvedValueOnce(product).mockReturnValueOnce(secondProductRequest);

    renderProduct();
    expect(await screen.findByRole("heading", { name: "Match Football" })).toBeVisible();

    fireEvent.click(screen.getByRole("link", { name: "Open product two" }));

    expect(screen.getByRole("status", { name: "Product loading" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Match Football" })).not.toBeInTheDocument();

    resolveSecondProduct(secondProduct);
    expect(await screen.findByRole("heading", { name: "Training Backpack" })).toBeVisible();
  });

  it("shows the not-found page for an unknown product", async () => {
    vi.mocked(fetchProductById).mockResolvedValue(null);
    renderProductWithRouteErrorBoundary();

    expect(await screen.findByRole("heading", { name: "This page doesn't exist" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Browse gear" })).toBeVisible();
    expect(screen.queryByText("Store header")).not.toBeInTheDocument();
    expect(screen.queryByText("Store footer")).not.toBeInTheDocument();
    expect(fetchCategoryTrail).not.toHaveBeenCalled();
  });

  it("lets the user retry a temporary product failure", async () => {
    vi.mocked(fetchProductById).mockRejectedValueOnce(new Error("Network unavailable")).mockResolvedValueOnce(product);
    renderProduct();

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't load this product");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Match Football" })).toBeVisible();
    expect(fetchProductById).toHaveBeenCalledTimes(2);
  });

  it("updates an existing load error when the language changes", async () => {
    vi.mocked(fetchProductById).mockRejectedValue(new Error("Unavailable"));
    renderProduct();

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't load this product");

    await act(async () => {
      await i18n.changeLanguage("ru");
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить товар");
    expect(screen.getByRole("button", { name: "Попробовать снова" })).toBeVisible();
    expect(fetchProductById).toHaveBeenCalledTimes(1);
  });
});
