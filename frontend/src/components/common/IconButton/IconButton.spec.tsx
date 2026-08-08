import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("uses its label as the accessible name and handles clicks", () => {
    const handleClick = vi.fn();

    render(<IconButton icon={<svg data-testid="menu-icon" />} label="Open menu" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Open menu" });
    const icon = screen.getByTestId("menu-icon");

    expect(button).toHaveClass("icon-button", "icon-button--medium", "icon-button--ghost");
    expect(button).toHaveAttribute("type", "button");
    expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("forwards native state and prevents clicks when disabled", () => {
    const handleClick = vi.fn();

    render(
      <IconButton
        aria-pressed="false"
        className="filter-button"
        disabled
        icon={<svg />}
        label="Open filters"
        onClick={handleClick}
        size="small"
        variant="subtle"
      />
    );

    const button = screen.getByRole("button", { name: "Open filters" });

    expect(button).toHaveClass("icon-button--small", "icon-button--subtle", "filter-button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
