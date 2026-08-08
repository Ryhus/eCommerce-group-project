import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { deCommon } from "./locales/de/common";
import { enCommon } from "./locales/en/common";
import { ruCommon } from "./locales/ru/common";
import {
  DEFAULT_LANGUAGE,
  detectLanguage,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from "./languages";

const browserLanguages = typeof navigator === "undefined" ? [] : navigator.languages;
const storedLanguage = typeof localStorage === "undefined" ? null : localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = detectLanguage(storedLanguage, browserLanguages);

export const i18nInitialization = i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    de: { common: deCommon },
    ru: { common: ruCommon },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: "common",
  interpolation: { escapeValue: false },
  returnNull: false,
});

function synchronizeDocument(language: string) {
  const supportedLanguage = normalizeLanguage(language) ?? DEFAULT_LANGUAGE;

  if (typeof localStorage !== "undefined") localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
  if (typeof document !== "undefined") {
    document.documentElement.lang = supportedLanguage;
    document.title = i18n.t("meta.title", { lng: supportedLanguage });
  }
}

i18n.on("languageChanged", synchronizeDocument);
void i18nInitialization.then(() => synchronizeDocument(i18n.resolvedLanguage ?? initialLanguage));

export default i18n;
