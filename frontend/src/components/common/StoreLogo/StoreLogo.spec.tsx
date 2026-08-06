import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { StoreLogo } from "./StoreLogo";

describe("StoreLogo", () => {
  it("renders the brand as an accessible home link", () => {
    render(
      <MemoryRouter>
        <StoreLogo className="header-logo" />
      </MemoryRouter>
    );

    const logo = screen.getByRole("link", { name: "Sport Gear home" });

    expect(logo).toHaveTextContent("SPORT GEAR");
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveClass("store-logo", "header-logo");
  });

  it("supports a custom destination and native link attributes", () => {
    render(
      <MemoryRouter>
        <StoreLogo data-testid="brand" to="/catalog" />
      </MemoryRouter>
    );

    expect(screen.getByTestId("brand")).toHaveAttribute("href", "/catalog");
  });
});
