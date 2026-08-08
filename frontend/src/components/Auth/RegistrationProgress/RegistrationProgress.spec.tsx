import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RegistrationProgress } from "./RegistrationProgress";

describe("RegistrationProgress", () => {
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
});
