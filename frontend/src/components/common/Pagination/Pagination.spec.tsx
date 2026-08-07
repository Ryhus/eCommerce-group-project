import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("moves between pages and marks the current page", () => {
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} onPageChange={onPageChange} pageSize={6} totalItems={18} />);

    expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));

    expect(onPageChange.mock.calls).toEqual([[1], [3], [3]]);
  });

  it("hides when all products fit on one page", () => {
    const { container } = render(<Pagination currentPage={1} onPageChange={vi.fn()} pageSize={6} totalItems={6} />);

    expect(container).toBeEmptyDOMElement();
  });
});
