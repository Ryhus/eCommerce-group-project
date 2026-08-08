export type EmailValidationErrorCode = "whitespace" | "atSymbol" | "parts" | "spaces" | "domain" | "format";

const EMAIL_VALIDATION_MESSAGES: Record<EmailValidationErrorCode, string> = {
  whitespace: "Email address must not contain leading or trailing whitespace.",
  atSymbol: "Email address must contain an '@' symbol separating local part and domain name.",
  parts: "Email address must contain a local part and a domain name.",
  spaces: "Email address must not contain spaces in the local or domain part.",
  domain: "Email address must contain a domain name (e.g., example.com).",
  format: "Email address must be properly formatted (e.g., user@example.com).",
};

export const getEmailValidationErrorCode = (value: string): EmailValidationErrorCode | null => {
  const trimmedValue = value.trim();

  if (trimmedValue !== value) {
    return "whitespace";
  }

  const atIndex = trimmedValue.indexOf("@");
  const hasAtSymbol = atIndex > 0 && atIndex === trimmedValue.lastIndexOf("@");

  if (!hasAtSymbol) {
    return "atSymbol";
  }

  const [localPart, domain] = trimmedValue.split("@");

  if (!localPart || !domain) {
    return "parts";
  }

  if (/\s/.test(localPart) || /\s/.test(domain)) {
    return "spaces";
  }

  const domainParts = domain.split(".");
  if (domainParts.length < 2 || domainParts.some((part) => part.length === 0)) {
    return "domain";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedValue)) {
    return "format";
  }

  return null;
};

export const validateEmailFormat = (value: string): string | null => {
  const errorCode = getEmailValidationErrorCode(value);
  return errorCode ? EMAIL_VALIDATION_MESSAGES[errorCode] : null;
};

export const validatePasswordStrength = (value: string): string | null => {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Password must include at least one digit.";
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(value)) return "Password must include at least one special character.";
  if (!/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_]+$/.test(value)) return "Password contains invalid characters.";
  return null;
};

export const validateName = (value: string, fieldName: string): string | null => {
  if (value.trim().length === 0) return `${fieldName} is required.`;
  if (!/^[A-Za-z\s'-]+$/.test(value)) return `${fieldName} contains invalid characters.`;
  return null;
};

export const validateDateOfBirth = (value: string): string | null => {
  const today = new Date();
  const dob = new Date(value);
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  const isOldEnough = age > 13 || (age === 13 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

  if (!value) return "Date of birth is required.";
  if (isNaN(dob.getTime())) return "Invalid date format.";
  if (!isOldEnough) return "You must be at least 13 years old.";
  return null;
};

export const validateStreet = (value: string): string | null => {
  return value.trim().length === 0 ? "Street is required." : null;
};

export const validateCity = (value: string): string | null => {
  if (value.trim().length === 0) return "City is required.";
  if (!/^[A-Za-z\s'-]+$/.test(value)) return "City contains invalid characters.";
  return null;
};

export const validatePostalCode = (value: string): string | null => {
  if (value.trim().length === 0) return "Postal code is required.";
  if (!/^[A-Za-z0-9 -]{3,}$/.test(value)) return "Invalid postal code format.";
  return null;
};

export const validateCountry = (value: string): string | null => {
  return value.trim().length === 0 ? "Please select a country." : null;
};
