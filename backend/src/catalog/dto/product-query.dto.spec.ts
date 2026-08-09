import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProductQueryDto } from "./product-query.dto.js";

describe("ProductQueryDto", () => {
  it("trims a valid search query", async () => {
    const query = plainToInstance(ProductQueryDto, { search: "  running shoes  " });

    expect(query.search).toBe("running shoes");
    expect(await validate(query)).toHaveLength(0);
  });

  it("rejects search queries longer than 100 characters", async () => {
    const query = plainToInstance(ProductQueryDto, { search: "a".repeat(101) });

    expect(await validate(query)).not.toHaveLength(0);
  });

  it("normalizes comma-separated filter values and price bounds", async () => {
    const query = plainToInstance(ProductQueryDto, {
      minPrice: "2500",
      maxPrice: "8000",
      colors: "Blue, blue, RED",
      sizes: [" Standard ", "large"],
    });

    expect(query).toMatchObject({
      minPrice: 2500,
      maxPrice: 8000,
      colors: ["blue", "red"],
      sizes: ["standard", "large"],
    });
    expect(await validate(query)).toHaveLength(0);
  });

  it("limits the number of values accepted by a facet", async () => {
    const query = plainToInstance(ProductQueryDto, {
      colors: Array.from({ length: 21 }, (_, index) => `color-${index}`).join(","),
    });

    expect(await validate(query)).not.toHaveLength(0);
  });
});
