import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FooterProjectLinks from "./FooterProjectLinks";

describe("FooterProjectLinks", () => {
  it("renders the real project resources as accessible external links", () => {
    render(<FooterProjectLinks />);

    expect(screen.getByRole("list", { name: "Project links" })).toBeInTheDocument();

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Sport Gear source code on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Ryhus/eCommerce-group-project"
    );

    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
