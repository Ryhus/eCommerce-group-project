export const validateEmailFormat = (value: string): boolean => {
  return /\S+@\S+\.\S+/.test(value);
};

export const validatePasswordStrength = (value: string): string | null => {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Password must include at least one digit.";
  if (!/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/.test(value)) return "Password contains invalid characters.";
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
