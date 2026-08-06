import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import FooterLinkColumn from "./FooterLinkColumn";

describe("FooterLinkColumn", () => {
  it("renders an accessible navigation group with internal links", () => {
    render(
      <MemoryRouter>
        <FooterLinkColumn
          links={[
            { href: "/catalog", label: "Catalog" },
            { href: "/basket", label: "Basket" },
          ]}
          title="Shop"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catalog" })).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("link", { name: "Basket" })).not.toHaveAttribute("target");
  });

  it("opens external links without exposing the originating page", () => {
    render(
      <MemoryRouter>
        <FooterLinkColumn
          links={[{ external: true, href: "https://github.com/example/project", label: "Source code" }]}
          title="Resources"
        />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Source code" });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
