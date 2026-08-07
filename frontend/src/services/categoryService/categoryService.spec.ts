import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../apiClient";
import { fetchCategoryTrail } from "./categoryService";

vi.mock("../apiClient", () => ({
  apiClient: { get: vi.fn() },
}));

describe("categoryService", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: "balls-id",
          name: "Balls",
          slug: "balls",
          parentId: null,
          children: [
            {
              id: "football-id",
              name: "Football",
              slug: "football",
              parentId: "balls-id",
              children: [],
            },
          ],
        },
      ],
    });
  });

  it("builds an ordered category trail from the cached tree", async () => {
    await expect(fetchCategoryTrail("football-id")).resolves.toEqual([
      expect.objectContaining({ id: "balls-id", name: "Balls" }),
      expect.objectContaining({ id: "football-id", name: "Football" }),
    ]);
    await expect(fetchCategoryTrail("unknown-id")).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledOnce();
  });
});
