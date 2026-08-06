import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Link from "./link";

describe("Link", () => {
  it("renders a real anchor and forwards native attributes", () => {
    const handleClick = vi.fn();

    render(<Link className="catalog-link" href="/catalog" onClick={handleClick} target="_blank" text="Catalog" />);

    const link = screen.getByRole("link", { name: "Catalog" });

    expect(link).toHaveClass("link", "catalog-link");
    expect(link).toHaveAttribute("href", "/catalog");
    expect(link).toHaveAttribute("target", "_blank");

    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("renders an icon before the link text", () => {
    render(<Link href="/basket" icon={<svg aria-label="Cart" />} text="(2)" />);

    const link = screen.getByRole("link", { name: "Cart (2)" });

    expect(link.querySelector(".link-icon")).toBeInTheDocument();
    expect(link).toHaveTextContent("(2)");
  });
});
