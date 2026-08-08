import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PasswordVisibilityButton } from "./PasswordVisibilityButton";

describe("PasswordVisibilityButton", () => {
  it("describes and toggles a hidden password", () => {
    const onToggle = vi.fn();

    render(<PasswordVisibilityButton isVisible={false} onToggle={onToggle} />);

    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("describes a visible password", () => {
    render(<PasswordVisibilityButton isVisible onToggle={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
  });
});
