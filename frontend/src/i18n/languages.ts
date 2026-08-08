export const SUPPORTED_LANGUAGES = ["en", "de", "ru"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "sport-gear-language";

export const LANGUAGE_OPTIONS: ReadonlyArray<{ code: SupportedLanguage; label: string }> = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
];

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
  if (!value) return null;
  const language = value.toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGES.find((supportedLanguage) => supportedLanguage === language) ?? null;
}

export function detectLanguage(storedLanguage: string | null, browserLanguages: readonly string[]): SupportedLanguage {
  const savedLanguage = normalizeLanguage(storedLanguage);
  if (savedLanguage) return savedLanguage;

  for (const browserLanguage of browserLanguages) {
    const supportedLanguage = normalizeLanguage(browserLanguage);
    if (supportedLanguage) return supportedLanguage;
  }

  return DEFAULT_LANGUAGE;
}
