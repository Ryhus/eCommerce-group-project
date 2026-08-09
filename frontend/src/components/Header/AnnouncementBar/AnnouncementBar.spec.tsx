import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";
import { AuthContext, type AuthContextValue } from "../../context/AuthContext";

import { AnnouncementBar } from "./AnnouncementBar";

describe("AnnouncementBar", () => {
  const authValue: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    loading: false,
    refreshUser: vi.fn(),
    logout: vi.fn(),
  };

  function renderAnnouncement(auth: Partial<AuthContextValue> = {}) {
    return render(
      <AuthContext.Provider value={{ ...authValue, ...auth }}>
        <MemoryRouter>
          <AnnouncementBar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }

  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the promotion and links to registration", () => {
    renderAnnouncement();

    const announcement = screen.getByRole("complementary", {
      name: "Promotional announcement",
    });
    const signUpLink = screen.getByRole("link", { name: "Sign Up Now" });

    expect(announcement).toHaveTextContent("Sign up and get 20% off your first order.");
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });

  it("can be dismissed", () => {
    renderAnnouncement();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss promotion" }));

    expect(screen.queryByRole("complementary", { name: "Promotional announcement" })).not.toBeInTheDocument();
  });

  it("updates the promotion when the language changes", async () => {
    await i18n.changeLanguage("de");

    renderAnnouncement();

    expect(screen.getByRole("complementary", { name: "Aktionsankündigung" })).toHaveTextContent(
      "Registriere dich und erhalte 20 % Rabatt auf deine erste Bestellung."
    );
    expect(screen.getByRole("link", { name: "Jetzt registrieren" })).toHaveAttribute("href", "/sign-up");
  });

  it("stays hidden while authentication is loading", () => {
    renderAnnouncement({ loading: true });

    expect(screen.queryByRole("complementary", { name: "Promotional announcement" })).not.toBeInTheDocument();
  });

  it("stays hidden for authenticated users", () => {
    renderAnnouncement({ isAuthenticated: true });

    expect(screen.queryByRole("complementary", { name: "Promotional announcement" })).not.toBeInTheDocument();
  });
});
