import { describe, expect, it } from "vitest";

import {
  hasRegistrationErrors,
  INITIAL_REGISTRATION_FORM,
  validateRegistrationStep,
  type RegistrationFormData,
} from "./registrationForm";

const validForm: RegistrationFormData = {
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex@example.com",
  password: "Strong!Pass1",
  confirmPassword: "Strong!Pass1",
  dateOfBirth: "1995-05-15",
  street: "10 Main Street",
  city: "Berlin",
  postalCode: "10115",
  country: "DE",
  useAsDefaultAddress: true,
};

describe("registration form validation", () => {
  it("validates only account fields on the first step", () => {
    const errors = validateRegistrationStep(0, INITIAL_REGISTRATION_FORM);

    expect(errors.firstName).toBe("First name is required.");
    expect(errors.email).toContain("'@' symbol");
    expect(errors.password).toBe("Password must be at least 8 characters.");
    expect(errors).not.toHaveProperty("dateOfBirth");
    expect(errors).not.toHaveProperty("street");
  });

  it("detects a confirmation mismatch independently", () => {
    const errors = validateRegistrationStep(0, { ...validForm, confirmPassword: "Different!Pass1" });

    expect(errors.confirmPassword).toBe("Passwords do not match.");
    expect(errors.firstName).toBeUndefined();
  });

  it("validates personal details and address on their own steps", () => {
    expect(validateRegistrationStep(1, INITIAL_REGISTRATION_FORM).dateOfBirth).toBe("Date of birth is required.");
    expect(validateRegistrationStep(2, INITIAL_REGISTRATION_FORM)).toMatchObject({
      street: "Street is required.",
      city: "City is required.",
      postalCode: "Postal code is required.",
      country: "Please select a country.",
    });
  });

  it("accepts a complete valid form", () => {
    expect(hasRegistrationErrors(validateRegistrationStep(0, validForm))).toBe(false);
    expect(hasRegistrationErrors(validateRegistrationStep(1, validForm))).toBe(false);
    expect(hasRegistrationErrors(validateRegistrationStep(2, validForm))).toBe(false);
  });
});
