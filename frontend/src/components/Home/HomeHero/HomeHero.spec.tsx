import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import HomeHero from "./HomeHero";

describe("HomeHero", () => {
  it("introduces the storefront with a catalog action and truthful demo metrics", () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "FIND GEAR THAT MATCHES YOUR GOALS", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop now" })).toHaveAttribute("href", "/catalog");
    expect(screen.getByText("8+")).toBeInTheDocument();
    expect(screen.getByText("Demo products")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Athlete running stadium steps" })).toBeInTheDocument();
  });
});
