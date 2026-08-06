import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../apiClient";
import { fetchProducts } from "./productService";

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
});
