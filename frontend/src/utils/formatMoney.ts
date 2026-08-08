import { DEFAULT_LANGUAGE, normalizeLanguage, type SupportedLanguage } from "../i18n/languages";

const MONEY_LOCALES: Record<SupportedLanguage, string> = {
  en: "en-IE",
  de: "de-DE",
  ru: "ru-RU",
};

export function formatMoney(amount: number, language?: string): string {
  const supportedLanguage = normalizeLanguage(language) ?? DEFAULT_LANGUAGE;

  return new Intl.NumberFormat(MONEY_LOCALES[supportedLanguage], {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}
