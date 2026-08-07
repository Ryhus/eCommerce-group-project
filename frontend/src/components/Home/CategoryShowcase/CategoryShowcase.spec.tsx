import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import CategoryShowcase from "./CategoryShowcase";

describe("CategoryShowcase", () => {
  it("links the visual tiles to real seeded catalog categories", () => {
    render(
      <MemoryRouter>
        <CategoryShowcase />
      </MemoryRouter>
    );

    expect(screen.getByRole("region", { name: "BROWSE BY SPORT" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Football" })).toHaveAttribute("href", "/catalog/balls/football");
    expect(screen.getByRole("link", { name: "Running" })).toHaveAttribute("href", "/catalog/shoes");
    expect(screen.getByRole("link", { name: "Strength" })).toHaveAttribute("href", "/catalog/fitness/strength");
    expect(screen.getByRole("link", { name: "Yoga" })).toHaveAttribute("href", "/catalog/fitness/yoga");
  });
});
