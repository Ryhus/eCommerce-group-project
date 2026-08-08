import { describe, expect, it, vi } from "vitest";

import { NewsletterService } from "./newsletter.service.js";

describe("NewsletterService", () => {
  it("upserts a normalized subscription and returns its original subscription date", async () => {
    const createdAt = new Date("2026-08-06T18:00:00.000Z");
    const prisma = {
      newsletterSubscription: {
        upsert: vi.fn().mockResolvedValue({ email: "shopper@example.com", createdAt }),
      },
    };

    const result = await new NewsletterService(prisma as never).subscribe("  SHOPPER@Example.com ");

    expect(prisma.newsletterSubscription.upsert).toHaveBeenCalledWith({
      where: { email: "shopper@example.com" },
      update: {},
      create: { email: "shopper@example.com" },
      select: { email: true, createdAt: true },
    });
    expect(result).toEqual({
      email: "shopper@example.com",
      subscribedAt: "2026-08-06T18:00:00.000Z",
    });
  });
});
