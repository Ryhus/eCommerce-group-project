import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../apiClient";
import { subscribeToNewsletter } from "./newsletterService";

vi.mock("../apiClient", () => ({
  apiClient: { post: vi.fn() },
}));

describe("newsletterService", () => {
  beforeEach(() => vi.mocked(apiClient.post).mockReset());

  it("subscribes an email through the newsletter API", async () => {
    const subscription = {
      email: "shopper@example.com",
      subscribedAt: "2026-08-06T18:00:00.000Z",
    };
    vi.mocked(apiClient.post).mockResolvedValue({ data: subscription });

    await expect(subscribeToNewsletter("shopper@example.com")).resolves.toEqual(subscription);
    expect(apiClient.post).toHaveBeenCalledWith("/newsletter/subscriptions", {
      email: "shopper@example.com",
    });
  });
});
