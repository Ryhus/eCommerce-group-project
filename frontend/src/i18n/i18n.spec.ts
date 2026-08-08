import { afterEach, describe, expect, it } from "vitest";

import i18n, { i18nInitialization } from "./i18n";
import { LANGUAGE_STORAGE_KEY } from "./languages";

describe("i18n", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("persists language changes and synchronizes document metadata", async () => {
    await i18nInitialization;
    await i18n.changeLanguage("de");

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("de");
    expect(document.documentElement.lang).toBe("de");
    expect(document.title).toBe("Sport Gear | Sportausrüstung");
  });
});
