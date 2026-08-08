import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import i18n from "../../i18n/i18n";
import NotFoundPage from "./NotFound";

function LocationDisplay() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderNotFound() {
  return render(
    <MemoryRouter initialEntries={["/missing-page"]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <NotFoundPage />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("NotFoundPage", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("presents the centered recovery actions without the old illustration copy", () => {
    renderNotFound();

    expect(screen.getByText("404")).toBeVisible();
    expect(screen.getByRole("heading", { name: "This page doesn't exist" })).toBeVisible();
    expect(
      screen.getByText("We couldn't find the page you're looking for. Explore our gear and find your next goal.")
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Back to home" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Browse gear" })).toBeVisible();
    expect(screen.queryByText("OUT OF BOUNDS")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("navigates to home and catalog from the recovery actions", () => {
    renderNotFound();

    fireEvent.click(screen.getByRole("button", { name: "Browse gear" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/catalog");

    fireEvent.click(screen.getByRole("button", { name: "Back to home" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });

  it("updates the recovery copy when the language changes", async () => {
    renderNotFound();

    await i18n.changeLanguage("de");
    expect(screen.getByRole("heading", { name: "Diese Seite existiert nicht" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Zur Startseite" })).toBeVisible();

    await i18n.changeLanguage("ru");
    expect(screen.getByRole("heading", { name: "Такой страницы не существует" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Перейти к экипировке" })).toBeVisible();
  });
});
