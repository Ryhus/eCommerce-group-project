import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import i18n from "../../../i18n/i18n";

import CategoryShowcase from "./CategoryShowcase";

describe("CategoryShowcase", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("links the visual tiles to real seeded catalog categories", () => {
    render(
      <MemoryRouter>
        <CategoryShowcase />
      </MemoryRouter>
    );

    expect(screen.getByRole("region", { name: "BROWSE BY SPORT" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Football" })).toHaveAttribute("href", "/catalog/balls/football");
    expect(screen.getByRole("link", { name: "Running" })).toHaveAttribute("href", "/catalog/shoes");
    expect(screen.getByRole("link", { name: "Strength" })).toHaveAttribute("href", "/catalog/fitness/strength");
    expect(screen.getByRole("link", { name: "Yoga" })).toHaveAttribute("href", "/catalog/fitness/yoga");
  });

  it("renders translated category labels without changing their destinations", async () => {
    await i18n.changeLanguage("ru");

    render(
      <MemoryRouter>
        <CategoryShowcase />
      </MemoryRouter>
    );

    expect(screen.getByRole("region", { name: "ВЫБЕРИТЕ ВИД СПОРТА" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Футбол" })).toHaveAttribute("href", "/catalog/balls/football");
    expect(screen.getByRole("link", { name: "Силовые тренировки" })).toHaveAttribute(
      "href",
      "/catalog/fitness/strength"
    );
  });
});
