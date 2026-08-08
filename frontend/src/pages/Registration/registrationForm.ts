import {
  validateCity,
  validateCountry,
  validateDateOfBirth,
  validateEmailFormat,
  validateName,
  validatePasswordStrength,
  validatePostalCode,
  validateStreet,
} from "../../utils/validation";

export type RegistrationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  useAsDefaultAddress: boolean;
};

export type RegistrationField = keyof RegistrationFormData;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;
export type RegistrationStep = 0 | 1 | 2;

export const INITIAL_REGISTRATION_FORM: RegistrationFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
  useAsDefaultAddress: false,
};

export const STEP_FIELDS: Record<RegistrationStep, RegistrationField[]> = {
  0: ["firstName", "lastName", "email", "password", "confirmPassword"],
  1: ["dateOfBirth"],
  2: ["street", "city", "postalCode", "country"],
};

export const COUNTRY_OPTIONS = [
  ["", "Select a country"],
  ["AT", "Austria"],
  ["BE", "Belgium"],
  ["BG", "Bulgaria"],
  ["HR", "Croatia"],
  ["CY", "Cyprus"],
  ["CZ", "Czech Republic"],
  ["DK", "Denmark"],
  ["EE", "Estonia"],
  ["FI", "Finland"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["GR", "Greece"],
  ["HU", "Hungary"],
  ["IE", "Ireland"],
  ["IT", "Italy"],
  ["LV", "Latvia"],
  ["LT", "Lithuania"],
  ["LU", "Luxembourg"],
  ["MT", "Malta"],
  ["NL", "Netherlands"],
  ["PL", "Poland"],
  ["PT", "Portugal"],
  ["RO", "Romania"],
  ["SK", "Slovakia"],
  ["SI", "Slovenia"],
  ["ES", "Spain"],
  ["SE", "Sweden"],
] as const;

function errorMessage(result: string | null) {
  return result ?? undefined;
}

export function validateRegistrationStep(step: RegistrationStep, data: RegistrationFormData): RegistrationErrors {
  if (step === 0) {
    return {
      firstName: errorMessage(validateName(data.firstName, "First name")),
      lastName: errorMessage(validateName(data.lastName, "Last name")),
      email: errorMessage(validateEmailFormat(data.email)),
      password: errorMessage(validatePasswordStrength(data.password)),
      confirmPassword: data.confirmPassword === data.password ? undefined : "Passwords do not match.",
    };
  }

  if (step === 1) {
    return { dateOfBirth: errorMessage(validateDateOfBirth(data.dateOfBirth)) };
  }

  return {
    street: errorMessage(validateStreet(data.street)),
    city: errorMessage(validateCity(data.city)),
    postalCode: errorMessage(validatePostalCode(data.postalCode)),
    country: errorMessage(validateCountry(data.country)),
  };
}

export function hasRegistrationErrors(errors: RegistrationErrors) {
  return Object.values(errors).some(Boolean);
}
