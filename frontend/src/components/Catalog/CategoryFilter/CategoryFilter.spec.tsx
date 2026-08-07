import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { CategoryFilter } from "./CategoryFilter";

describe("CategoryFilter", () => {
  it("renders supported category links and closes after navigation", () => {
    const onNavigate = vi.fn();

    render(
      <MemoryRouter>
        <CategoryFilter
          items={[{ id: "balls", isActive: true, name: "Balls", to: "/catalog/balls" }]}
          onNavigate={onNavigate}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Balls" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "All products" })).toHaveAttribute("href", "/catalog");

    fireEvent.click(screen.getByRole("link", { name: "Balls" }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });
});
