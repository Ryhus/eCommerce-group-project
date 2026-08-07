import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Sorting from "./Sorting";

describe("Sorting", () => {
  it("shows the current sort and reports a new selection", () => {
    const onSortChange = vi.fn();

    render(<Sorting currentSort="default" onSortChange={onSortChange} />);

    const select = screen.getByRole("combobox", { name: "Sort products" });
    expect(select).toHaveValue("default");

    fireEvent.change(select, { target: { value: "price asc" } });

    expect(onSortChange).toHaveBeenCalledWith("price asc");
  });
});
