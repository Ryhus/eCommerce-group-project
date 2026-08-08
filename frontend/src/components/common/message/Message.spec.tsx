import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Message from "./Message";

describe("Message", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders a polite success status and closes after the duration", () => {
    const handleClose = vi.fn();

    render(<Message duration={2000} onClose={handleClose} text="Product removed" />);

    const message = screen.getByRole("status");

    expect(message).toHaveClass("message", "message--success");
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(message).toHaveAttribute("aria-atomic", "true");

    act(() => vi.advanceTimersByTime(1999));
    expect(handleClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("renders errors as assertive alerts and forwards native attributes", () => {
    render(
      <Message className="cart-error" id="cart-error" onClose={vi.fn()} text="Unable to update cart" variant="error" />
    );

    const message = screen.getByRole("alert");

    expect(message).toHaveClass("message", "message--error", "cart-error");
    expect(message).toHaveAttribute("aria-live", "assertive");
    expect(message).toHaveAttribute("id", "cart-error");
  });

  it("clears the pending timer when it unmounts", () => {
    const handleClose = vi.fn();
    const { unmount } = render(<Message onClose={handleClose} text="Saved" />);

    unmount();
    act(() => vi.runAllTimers());

    expect(handleClose).not.toHaveBeenCalled();
  });
});
