import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Breadcrumbs from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("marks the last category as the current page", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs
          crumbs={[
            { name: "Fitness", path: "/catalog/fitness" },
            { name: "Yoga", path: "/catalog/fitness/yoga" },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    expect(screen.getByText("Yoga")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Fitness" })).toHaveAttribute("href", "/catalog/fitness");
  });

  it("supports pages outside the catalog hierarchy", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs crumbs={[{ name: "Cart", path: "/basket" }]} includeCatalog={false} />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("HomeCart");
    expect(screen.queryByText("Catalog")).not.toBeInTheDocument();
    expect(screen.getByText("Cart")).toHaveAttribute("aria-current", "page");
  });
});
