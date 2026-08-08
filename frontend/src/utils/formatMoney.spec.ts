import { describe, expect, it } from "vitest";

import { formatMoney } from "./formatMoney";

describe("formatMoney", () => {
  it("formats minor units using the selected supported locale", () => {
    expect(formatMoney(7999, "en")).toBe("€79.99");
    expect(formatMoney(7999, "de")).toBe("79,99 €");
    expect(formatMoney(7999, "ru")).toBe("79,99 €");
  });

  it("normalizes regional language tags and falls back to English", () => {
    expect(formatMoney(123456, "de-AT")).toBe("1.234,56 €");
    expect(formatMoney(123456, "fr-FR")).toBe("€1,234.56");
  });
});
