import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import i18n from "../../i18n/i18n";
import AboutPage from "./About";

describe("AboutPage", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("introduces the three team members with their current roles and contributions", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Meet our team" })).toBeVisible();
    expect(screen.getByText("The people behind Sport Gear and the work that brought the store to life.")).toBeVisible();

    const members = screen.getAllByRole("article");
    expect(members).toHaveLength(3);
    expect(within(members[0]).getByText("Team Lead & Full-Stack Developer")).toBeVisible();
    expect(within(members[0]).getByText("Designed the frontend and backend architecture")).toBeVisible();
    expect(within(members[1]).getByText("Full-Stack Developer")).toBeVisible();
    expect(within(members[2]).getByText("Frontend Developer & QA")).toBeVisible();
    expect(within(members[2]).getByText("Tested critical user flows and application quality")).toBeVisible();
  });

  it("uses a storefront breadcrumb and real team profile links", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("HomeAbout");
    expect(screen.queryByText("Catalog")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Yevhen Ryhus" })).toHaveAttribute("src", "/photos/Ryhus.jpg");
    expect(screen.getByRole("link", { name: "View Yevhen Ryhus's GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/ryhus"
    );
    expect(screen.getByRole("link", { name: "View Natalia Andreeva's GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/n-andr"
    );
    expect(screen.getByRole("link", { name: "View Olha Teplova's GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/ola793"
    );
  });

  it("updates the page and team labels when the language changes", async () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    await i18n.changeLanguage("de");

    expect(screen.getByRole("heading", { level: 1, name: "Unser Team" })).toBeVisible();
    expect(
      screen.getByText("Die Menschen hinter Sport Gear und die Arbeit, die diesen Shop zum Leben erweckt hat.")
    ).toBeVisible();
    expect(screen.getByText("Teamleitung & Full-Stack-Entwicklung")).toBeVisible();
    expect(screen.getByRole("list", { name: "Beiträge von Yevhen Ryhus" })).toBeVisible();
    expect(screen.getByRole("link", { name: "GitHub-Profil von Yevhen Ryhus ansehen" })).toBeVisible();

    await i18n.changeLanguage("ru");

    expect(screen.getByRole("heading", { level: 1, name: "Наша команда" })).toBeVisible();
    expect(screen.getByText("Full-Stack разработчик")).toBeVisible();
    expect(screen.getByRole("list", { name: "Вклад Yevhen Ryhus" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Открыть GitHub-профиль Yevhen Ryhus" })).toBeVisible();
  });
});
