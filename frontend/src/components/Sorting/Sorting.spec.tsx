import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../i18n/i18n";

import Sorting from "./Sorting";

describe("Sorting", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows the current sort and reports a new selection", () => {
    const onSortChange = vi.fn();

    render(<Sorting currentSort="default" onSortChange={onSortChange} />);

    const select = screen.getByRole("combobox", { name: "Sort products" });
    expect(select).toHaveValue("default");

    fireEvent.change(select, { target: { value: "price asc" } });

    expect(onSortChange).toHaveBeenCalledWith("price asc");
  });

  it("localizes labels while preserving stable sort values", async () => {
    await i18n.changeLanguage("de");
    const onSortChange = vi.fn();

    render(<Sorting currentSort="default" onSortChange={onSortChange} />);

    const select = screen.getByRole("combobox", { name: "Produkte sortieren" });
    expect(screen.getByText("Sortieren nach:")).toBeVisible();
    expect(screen.getByRole("option", { name: "Preis: aufsteigend" })).toHaveValue("price asc");

    fireEvent.change(select, { target: { value: "name desc" } });
    expect(onSortChange).toHaveBeenCalledWith("name desc");
  });
});
