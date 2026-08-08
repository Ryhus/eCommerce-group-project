import { describe, expect, it } from "vitest";

import { validatePasswordStrength } from "./validation";

describe("validatePasswordStrength", () => {
  it("accepts an underscore as the required special character", () => {
    expect(validatePasswordStrength("Strong_Pass1")).toBeNull();
  });

  it("rejects characters outside the supported password alphabet", () => {
    expect(validatePasswordStrength("Strong/Pass1!")).toBe("Password contains invalid characters.");
  });
});
