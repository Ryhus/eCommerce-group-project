import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import i18n from "../../../i18n/i18n";

import { RegistrationProgress } from "./RegistrationProgress";

describe("RegistrationProgress", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("marks previous, current and upcoming steps", () => {
    render(<RegistrationProgress currentStep={1} />);

    const progress = screen.getByRole("navigation", { name: "Registration progress" });
    const steps = screen.getAllByRole("listitem");

    expect(progress).toBeVisible();
    expect(steps[0]).toHaveClass("registration-progress__completed");
    expect(steps[1]).toHaveClass("registration-progress__current");
    expect(steps[1]).toHaveAttribute("aria-current", "step");
    expect(steps[2]).toHaveClass("registration-progress__upcoming");
  });

  it("localizes labels without changing progress semantics", async () => {
    await i18n.changeLanguage("ru");
    render(<RegistrationProgress currentStep={2} />);

    expect(screen.getByRole("navigation", { name: "Этапы регистрации" })).toBeVisible();
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Аккаунт");
    expect(screen.getAllByRole("listitem")[2]).toHaveAttribute("aria-current", "step");
  });
});
