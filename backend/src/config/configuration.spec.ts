import { describe, expect, it } from "vitest";
import { validateConfig } from "./configuration.js";

const valid = {
  DATABASE_URL: "postgresql://localhost/store",
  JWT_ACCESS_SECRET: "a".repeat(32),
  COOKIE_SECRET: "b".repeat(32),
};

describe("validateConfig", () => {
  it("applies safe development defaults", () => {
    expect(validateConfig(valid)).toMatchObject({
      NODE_ENV: "development",
      PORT: 3000,
      REFRESH_TOKEN_DAYS: 30,
      ACCESS_TOKEN_TTL: "15m",
    });
  });

  it("rejects short secrets", () => {
    expect(() => validateConfig({ ...valid, COOKIE_SECRET: "short" })).toThrow("COOKIE_SECRET");
  });
});
