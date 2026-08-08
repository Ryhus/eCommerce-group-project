import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";

import { CategoryFilter } from "./CategoryFilter";

describe("CategoryFilter", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders supported category links and closes after navigation", () => {
    const onNavigate = vi.fn();

    render(
      <MemoryRouter>
        <CategoryFilter
          items={[{ id: "balls", isActive: true, name: "Balls", to: "/catalog/balls" }]}
          onNavigate={onNavigate}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Balls" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "All products" })).toHaveAttribute("href", "/catalog");

    fireEvent.click(screen.getByRole("link", { name: "Balls" }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("localizes the section and all-products link", async () => {
    await i18n.changeLanguage("ru");

    render(
      <MemoryRouter>
        <CategoryFilter items={[]} />
      </MemoryRouter>
    );

    expect(screen.getByRole("region", { name: "Категории" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Все товары" })).toHaveAttribute("href", "/catalog");
  });
});
