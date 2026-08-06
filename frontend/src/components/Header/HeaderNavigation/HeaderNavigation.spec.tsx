import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { HeaderNavigation } from "./HeaderNavigation";

describe("HeaderNavigation", () => {
  it("marks the current catalog section as active", () => {
    render(
      <MemoryRouter initialEntries={["/catalog/running"]}>
        <HeaderNavigation />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveClass("header-navigation--horizontal");
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("supports vertical navigation and reports link selection", () => {
    const handleNavigate = vi.fn();

    render(
      <MemoryRouter>
        <HeaderNavigation onNavigate={handleNavigate} orientation="vertical" />
      </MemoryRouter>
    );

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(navigation).toHaveClass("header-navigation--vertical");

    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(handleNavigate).toHaveBeenCalledOnce();
  });
});
