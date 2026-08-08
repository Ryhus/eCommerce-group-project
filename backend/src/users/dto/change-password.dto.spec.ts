import { describe, expect, it } from "vitest";

import { STRONG_PASSWORD } from "./change-password.dto.js";

describe("STRONG_PASSWORD", () => {
  it("accepts an underscore as the required special character", () => {
    expect(STRONG_PASSWORD.test("Strong_Pass1")).toBe(true);
  });

  it("rejects characters outside the supported password alphabet", () => {
    expect(STRONG_PASSWORD.test("Strong/Pass1!")).toBe(false);
  });
});
