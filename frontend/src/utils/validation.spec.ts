import { describe, expect, it } from "vitest";

import { getEmailValidationErrorCode, validateEmailFormat, validatePasswordStrength } from "./validation";

describe("email validation", () => {
  it("returns semantic codes without changing the legacy message API", () => {
    expect(getEmailValidationErrorCode("shopper.example.com")).toBe("atSymbol");
    expect(validateEmailFormat("shopper.example.com")).toBe(
      "Email address must contain an '@' symbol separating local part and domain name."
    );
  });

  it("accepts a complete email address", () => {
    expect(getEmailValidationErrorCode("shopper@example.com")).toBeNull();
    expect(validateEmailFormat("shopper@example.com")).toBeNull();
  });
});

describe("validatePasswordStrength", () => {
  it("accepts an underscore as the required special character", () => {
    expect(validatePasswordStrength("Strong_Pass1")).toBeNull();
  });

  it("rejects characters outside the supported password alphabet", () => {
    expect(validatePasswordStrength("Strong/Pass1!")).toBe("Password contains invalid characters.");
  });
});
