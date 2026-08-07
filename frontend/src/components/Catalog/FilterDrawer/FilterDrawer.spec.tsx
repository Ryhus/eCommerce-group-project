import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FilterDrawer } from "./FilterDrawer";

describe("FilterDrawer", () => {
  it("renders as a modal dialog and closes with Escape", () => {
    const onClose = vi.fn();

    render(
      <FilterDrawer isOpen onClose={onClose}>
        <p>Available filters</p>
      </FilterDrawer>
    );

    expect(screen.getByRole("dialog", { name: "Catalog options" })).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not render while closed", () => {
    render(
      <FilterDrawer isOpen={false} onClose={vi.fn()}>
        <p>Available filters</p>
      </FilterDrawer>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
