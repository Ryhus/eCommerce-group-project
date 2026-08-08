import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import i18n from "../../i18n/i18n";

import Footer from "./Footer";

describe("Footer", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the newsletter, real navigation and project information", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "STAY UP TO DATE ABOUT OUR LATEST OFFERS" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Company" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sport Gear home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Demo store · Payments are not processed")).toBeInTheDocument();
  });

  it("renders navigation and project information in German", async () => {
    await i18n.changeLanguage("de");

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "VERPASSE KEINE UNSERER NEUESTEN ANGEBOTE" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Unternehmen" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Konto" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Konto erstellen" })).toHaveAttribute("href", "/sign-up");
    expect(screen.getByRole("list", { name: "Projektlinks" })).toBeVisible();
    expect(screen.getByText("Demo-Shop · Zahlungen werden nicht verarbeitet")).toBeVisible();
  });
});
