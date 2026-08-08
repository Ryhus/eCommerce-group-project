import { describe, expect, it } from "vitest";

import { detectLanguage, normalizeLanguage } from "./languages";

describe("language detection", () => {
  it("normalizes supported regional language tags", () => {
    expect(normalizeLanguage("de-DE")).toBe("de");
    expect(normalizeLanguage("RU-ru")).toBe("ru");
    expect(normalizeLanguage("fr-FR")).toBeNull();
  });

  it("prefers a stored language over browser preferences", () => {
    expect(detectLanguage("ru", ["de-DE", "en-US"])).toBe("ru");
  });

  it("uses a supported browser language and falls back to English", () => {
    expect(detectLanguage(null, ["fr-FR", "de-DE"])).toBe("de");
    expect(detectLanguage("fr", ["es-ES"])).toBe("en");
  });
});
