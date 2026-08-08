import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "../../components/context/useAuth";
import i18n from "../../i18n/i18n";
import { GuestOnlyRoute } from "./GuestOnlyRoute";

vi.mock("../../components/context/useAuth", () => ({ useAuth: vi.fn() }));

function renderRoute() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route element={<h1>Login form</h1>} path="login" />
        </Route>
        <Route element={<h1>Storefront</h1>} path="/" />
      </Routes>
    </MemoryRouter>
  );
}

describe("GuestOnlyRoute", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, loading: false } as never);
  });

  it("renders the guest page after authentication has been checked", () => {
    renderRoute();

    expect(screen.getByRole("heading", { name: "Login form" })).toBeVisible();
  });

  it("does not render the guest page while authentication is loading", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, loading: true } as never);

    renderRoute();

    expect(screen.getByRole("status")).toHaveTextContent("Checking your account");
    expect(screen.queryByRole("heading", { name: "Login form" })).not.toBeInTheDocument();
  });

  it("redirects authenticated customers without rendering the guest page", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, loading: false } as never);

    renderRoute();

    expect(screen.getByRole("heading", { name: "Storefront" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Login form" })).not.toBeInTheDocument();
  });

  it("localizes the account check", async () => {
    await i18n.changeLanguage("de");
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, loading: true } as never);

    renderRoute();

    expect(screen.getByRole("status")).toHaveTextContent("Dein Konto wird geprüft…");
  });
});
