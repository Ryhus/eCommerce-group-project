import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import i18n, { i18nInitialization } from "../../../i18n/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeAll(async () => {
    await i18nInitialization;
  });

  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows two-letter codes and changes the active language", async () => {
    render(<LanguageSwitcher />);

    const trigger = screen.getByRole("button", { name: "Current language: English" });
    expect(trigger).toHaveTextContent("EN");

    fireEvent.click(trigger);
    expect(screen.getByRole("menu", { name: "Available languages" })).toBeVisible();
    expect(screen.getByRole("menuitemradio", { name: "DE Deutsch" })).toHaveAttribute("aria-checked", "false");

    fireEvent.click(screen.getByRole("menuitemradio", { name: "DE Deutsch" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Aktuelle Sprache: Deutsch" })).toHaveTextContent("DE")
    );
  });

  it("supports keyboard opening, navigation, and closing", async () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: "Current language: English" });

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const englishOption = screen.getByRole("menuitemradio", { name: "EN English" });
    const germanOption = screen.getByRole("menuitemradio", { name: "DE Deutsch" });

    await waitFor(() => expect(englishOption).toHaveFocus());
    fireEvent.keyDown(englishOption, { key: "ArrowDown" });
    expect(germanOption).toHaveFocus();

    fireEvent.keyDown(germanOption, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
