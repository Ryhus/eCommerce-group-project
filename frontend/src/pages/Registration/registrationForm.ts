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

const REGISTRATION_ERROR_KEYS: Record<string, string> = {
  "First name is required.": "registrationValidation.firstNameRequired",
  "First name contains invalid characters.": "registrationValidation.firstNameInvalidCharacters",
  "Last name is required.": "registrationValidation.lastNameRequired",
  "Last name contains invalid characters.": "registrationValidation.lastNameInvalidCharacters",
  "Email address must not contain leading or trailing whitespace.": "emailValidation.whitespace",
  "Email address must contain an '@' symbol separating local part and domain name.": "emailValidation.atSymbol",
  "Email address must contain a local part and a domain name.": "emailValidation.parts",
  "Email address must not contain spaces in the local or domain part.": "emailValidation.spaces",
  "Email address must contain a domain name (e.g., example.com).": "emailValidation.domain",
  "Email address must be properly formatted (e.g., user@example.com).": "emailValidation.format",
  "Password must be at least 8 characters.": "registrationValidation.passwordLength",
  "Password must include at least one uppercase letter.": "registrationValidation.passwordUppercase",
  "Password must include at least one lowercase letter.": "registrationValidation.passwordLowercase",
  "Password must include at least one digit.": "registrationValidation.passwordDigit",
  "Password must include at least one special character.": "registrationValidation.passwordSpecial",
  "Password contains invalid characters.": "registrationValidation.passwordCharacters",
  "Passwords do not match.": "registrationValidation.passwordMatch",
  "Date of birth is required.": "registrationValidation.dateRequired",
  "Invalid date format.": "registrationValidation.dateInvalid",
  "You must be at least 13 years old.": "registrationValidation.dateTooYoung",
  "Street is required.": "registrationValidation.streetRequired",
  "City is required.": "registrationValidation.cityRequired",
  "City contains invalid characters.": "registrationValidation.cityInvalidCharacters",
  "Postal code is required.": "registrationValidation.postalRequired",
  "Invalid postal code format.": "registrationValidation.postalInvalid",
  "Please select a country.": "registrationValidation.countryRequired",
};

export function getRegistrationErrorKey(error?: string) {
  return error ? (REGISTRATION_ERROR_KEYS[error] ?? error) : "";
}

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

export const REGISTRATION_FIELD_IDS: Record<RegistrationField, string> = {
  firstName: "registration-first-name",
  lastName: "registration-last-name",
  email: "registration-email",
  password: "registration-password",
  confirmPassword: "registration-confirm-password",
  dateOfBirth: "registration-date-of-birth",
  street: "registration-street",
  city: "registration-city",
  postalCode: "registration-postal-code",
  country: "registration-country",
  useAsDefaultAddress: "registration-default-address",
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
