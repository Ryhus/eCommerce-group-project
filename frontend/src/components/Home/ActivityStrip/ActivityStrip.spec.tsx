import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import i18n from "../../../i18n/i18n";

import ActivityStrip from "./ActivityStrip";

describe("ActivityStrip", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("presents activity areas without unsupported brand claims", () => {
    render(<ActivityStrip />);

    expect(screen.getByRole("group", { name: "Sport Gear activities" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Run",
      "Train",
      "Play",
      "Recover",
      "Explore",
    ]);
  });

  it("translates the activity labels and accessible name", async () => {
    await i18n.changeLanguage("ru");

    render(<ActivityStrip />);

    expect(screen.getByRole("group", { name: "Направления Sport Gear" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Бег",
      "Тренировки",
      "Игры",
      "Восстановление",
      "Активный отдых",
    ]);
  });
});
