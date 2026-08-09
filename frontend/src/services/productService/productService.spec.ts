import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../apiClient";
import { fetchCatalogFilters, fetchProductById, fetchProductPage, fetchProducts } from "./productService";

vi.mock("../apiClient", () => ({
  apiClient: { get: vi.fn() },
}));

describe("productService", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { items: [], offset: 0, limit: 20, total: 0 },
    });
  });

  it("sends normalized catalog search parameters to the API", async () => {
    await fetchProducts({
      categoryId: "category-id",
      sort: "price asc",
      search: "  running shoes  ",
      offset: 20,
      limit: 10,
    });

    expect(apiClient.get).toHaveBeenCalledWith("/catalog/products", {
      params: {
        categoryId: "category-id",
        search: "running shoes",
        sort: "PRICE_ASC",
        offset: 20,
        limit: 10,
      },
    });
  });

  it("omits an empty search parameter", async () => {
    await fetchProducts({ search: "   " });

    expect(apiClient.get).toHaveBeenCalledWith("/catalog/products", {
      params: { sort: "RELEVANCE", offset: 0, limit: 20 },
    });
  });

  it("sends price and attribute filters as compact query parameters", async () => {
    await fetchProducts({
      minPrice: 2500,
      maxPrice: 8000,
      colors: ["blue", "red"],
      sizes: ["standard"],
      equipmentTypes: ["hydration"],
    });

    expect(apiClient.get).toHaveBeenCalledWith("/catalog/products", {
      params: {
        minPrice: 2500,
        maxPrice: 8000,
        colors: "blue,red",
        sizes: "standard",
        equipmentTypes: "hydration",
        sort: "RELEVANCE",
        offset: 0,
        limit: 20,
      },
    });
  });

  it("loads filter metadata for the selected category", async () => {
    const filters = {
      price: { min: 2500, max: 8000 },
      colors: [{ value: "blue", count: 2 }],
      sizes: [{ value: "standard", count: 3 }],
      equipmentTypes: [{ value: "hydration", count: 1 }],
    };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: filters });

    await expect(fetchCatalogFilters("category-id")).resolves.toEqual(filters);
    expect(apiClient.get).toHaveBeenCalledWith("/catalog/filters", { params: { categoryId: "category-id" } });
  });

  it("returns pagination metadata with mapped products", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "product-id",
            slug: "match-football",
            name: "Match Football",
            description: null,
            images: [{ url: "football.jpg", alt: "Match Football" }],
            price: { amount: 3499, currency: "EUR" },
            compareAtPrice: { amount: 4499, currency: "EUR" },
            categoryIds: ["football-id"],
          },
        ],
        offset: 6,
        limit: 6,
        total: 8,
      },
    });

    await expect(fetchProductPage({ offset: 6, limit: 6 })).resolves.toEqual({
      items: [
        {
          id: "product-id",
          slug: "match-football",
          name: "Match Football",
          description: "",
          imgUrls: ["football.jpg"],
          categoryIds: ["football-id"],
          currentPrice: 3499,
          oldPrice: 4499,
        },
      ],
      offset: 6,
      limit: 6,
      total: 8,
    });
  });

  it("maps a product detail response including its categories", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        id: "product-id",
        slug: "match-football",
        name: "Match Football",
        description: "Competition-ready football.",
        images: [{ url: "football.jpg", alt: "Match Football" }],
        price: { amount: 3499, currency: "EUR" },
        compareAtPrice: null,
        categoryIds: ["football-id"],
      },
    });

    await expect(fetchProductById("product-id")).resolves.toEqual({
      id: "product-id",
      slug: "match-football",
      name: "Match Football",
      description: "Competition-ready football.",
      imgUrls: ["football.jpg"],
      categoryIds: ["football-id"],
      currentPrice: 3499,
      oldPrice: 3499,
    });
  });

  it("returns null only when the product does not exist", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(
      new AxiosError("Not found", "ERR_BAD_REQUEST", undefined, undefined, { status: 404 } as never)
    );

    await expect(fetchProductById("missing-id")).resolves.toBeNull();
  });

  it("preserves unexpected API failures for the page to handle", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("Network unavailable"));

    await expect(fetchProductById("product-id")).rejects.toThrow("Network unavailable");
  });
});
