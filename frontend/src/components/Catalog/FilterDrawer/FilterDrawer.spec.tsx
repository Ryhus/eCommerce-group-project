import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";

import { FilterDrawer } from "./FilterDrawer";

describe("FilterDrawer", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders as a modal dialog and closes with Escape", () => {
    const onClose = vi.fn();

    render(
      <FilterDrawer isOpen onClose={onClose}>
        <p>Available filters</p>
      </FilterDrawer>
    );

    expect(screen.getByRole("dialog", { name: "Catalog options" })).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not render while closed", () => {
    render(
      <FilterDrawer isOpen={false} onClose={vi.fn()}>
        <p>Available filters</p>
      </FilterDrawer>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("localizes the dialog and close action", async () => {
    await i18n.changeLanguage("de");

    render(
      <FilterDrawer isOpen onClose={vi.fn()}>
        <p>Filter</p>
      </FilterDrawer>
    );

    expect(screen.getByRole("dialog", { name: "Katalogoptionen" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Katalogoptionen schließen" })).toBeVisible();
  });
});
