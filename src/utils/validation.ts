export const validateEmailFormat = (value: string): boolean => {
  return /\S+@\S+\.\S+/.test(value);
};

export const validatePasswordStrength = (value: string): string | null => {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must include at least one uppercase letter.";
  if (!/[0-9]/.test(value)) return "Password must include at least one digit.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must include at least one special character.";
  if (!/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/.test(value)) return "Password contains invalid characters.";
  return null;
};
