import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { QuantitySelector } from "./QuantitySelector";

describe("QuantitySelector", () => {
  it("requests quantity changes within its limits", () => {
    const onChange = vi.fn();
    const { rerender } = render(<QuantitySelector onChange={onChange} value={2} />);

    fireEvent.click(screen.getByRole("button", { name: "Decrease quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));

    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 3);

    rerender(<QuantitySelector max={3} onChange={onChange} value={3} />);
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
  });

  it("does not allow a quantity below one", () => {
    render(<QuantitySelector onChange={vi.fn()} value={1} />);

    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();
    expect(screen.getByRole("status", { name: "Quantity" })).toHaveTextContent("1");
  });
});
