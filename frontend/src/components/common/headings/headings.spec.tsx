import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { H1 } from "./H1";
import { H2 } from "./H2";
import { H3 } from "./H3";

describe("headings", () => {
  it("renders the correct semantic heading levels", () => {
    render(
      <>
        <H1 text="Storefront" />
        <H2 text="New arrivals" />
        <H3 text="Casual" />
      </>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Storefront" })).toHaveClass("heading", "h1");
    expect(screen.getByRole("heading", { level: 2, name: "New arrivals" })).toHaveClass("heading", "h2");
    expect(screen.getByRole("heading", { level: 3, name: "Casual" })).toHaveClass("heading", "h3");
  });

  it("forwards native heading attributes and custom classes", () => {
    render(<H2 aria-label="Catalog heading" className="catalog-title" id="catalog" text="Products" />);

    const heading = screen.getByRole("heading", { level: 2, name: "Catalog heading" });

    expect(heading).toHaveClass("heading", "h2", "catalog-title");
    expect(heading).toHaveAttribute("id", "catalog");
  });
});
