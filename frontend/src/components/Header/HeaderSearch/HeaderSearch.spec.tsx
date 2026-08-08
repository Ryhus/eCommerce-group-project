import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { HeaderSearch } from "./HeaderSearch";

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Current location">{`${location.pathname}${location.search}`}</output>;
}

describe("HeaderSearch", () => {
  it("reads the current query and navigates to normalized search results", () => {
    const handleSearch = vi.fn();

    render(
      <MemoryRouter initialEntries={["/catalog?search=shirt"]}>
        <HeaderSearch onSearch={handleSearch} />
        <LocationProbe />
      </MemoryRouter>
    );

    const input = screen.getByRole("searchbox", { name: "Search for products" });
    expect(input).toHaveValue("shirt");

    fireEvent.change(input, { target: { value: "  running shoes  " } });
    fireEvent.submit(screen.getByRole("search", { name: "Product search" }));

    expect(screen.getByLabelText("Current location")).toHaveTextContent("/catalog?search=running+shoes");
    expect(handleSearch).toHaveBeenCalledOnce();
  });

  it("navigates to the unfiltered catalog for an empty query", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <HeaderSearch />
        <LocationProbe />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole("search", { name: "Product search" }));

    expect(screen.getByLabelText("Current location")).toHaveTextContent("/catalog");
  });
});
