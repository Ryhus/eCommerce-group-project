import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";
import { PasswordVisibilityButton } from "./PasswordVisibilityButton";

describe("PasswordVisibilityButton", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

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

  it("uses the active interface language", async () => {
    await i18n.changeLanguage("ru");
    render(<PasswordVisibilityButton isVisible={false} onToggle={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Показать пароль" })).toHaveAttribute("title", "Показать пароль");
  });
});
