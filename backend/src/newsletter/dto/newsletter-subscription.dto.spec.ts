import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CreateNewsletterSubscriptionDto } from "./newsletter-subscription.dto.js";

describe("CreateNewsletterSubscriptionDto", () => {
  it("normalizes a valid email", async () => {
    const input = plainToInstance(CreateNewsletterSubscriptionDto, { email: "  SHOPPER@Example.com  " });

    expect(input.email).toBe("shopper@example.com");
    expect(await validate(input)).toHaveLength(0);
  });

  it("rejects invalid email addresses", async () => {
    const input = plainToInstance(CreateNewsletterSubscriptionDto, { email: "not-an-email" });

    expect(await validate(input)).not.toHaveLength(0);
  });
});
