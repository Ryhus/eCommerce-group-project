import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../apiClient";
import { fetchProductPage, fetchProducts } from "./productService";

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
          currentPrice: 3499,
          oldPrice: 4499,
        },
      ],
      offset: 6,
      limit: 6,
      total: 8,
    });
  });
});
