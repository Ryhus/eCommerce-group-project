import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import i18n from "../../../i18n/i18n";

import HomeHero from "./HomeHero";

describe("HomeHero", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("introduces the storefront with a catalog action and truthful demo metrics", () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "FIND GEAR THAT MATCHES YOUR GOALS", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop now" })).toHaveAttribute("href", "/catalog");
    expect(screen.getByText("8+")).toBeInTheDocument();
    expect(screen.getByText("Demo products")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Athlete running stadium steps" })).toBeInTheDocument();
  });

  it("renders localized content in German", async () => {
    await i18n.changeLanguage("de");

    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "FINDE AUSRÜSTUNG, DIE ZU DEINEN ZIELEN PASST", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Jetzt shoppen" })).toHaveAttribute("href", "/catalog");
    expect(screen.getByText("Demo-Produkte")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Athletin läuft Stadiontreppen hinauf" })).toBeInTheDocument();
  });
});
