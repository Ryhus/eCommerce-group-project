import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Span from "./span";

describe("Span", () => {
  it("renders inline text and forwards native span attributes", () => {
    render(<Span className="announcement-copy" data-testid="announcement" text="Sign up and save 20%" />);

    const span = screen.getByTestId("announcement");

    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveClass("span", "announcement-copy");
    expect(span).toHaveTextContent("Sign up and save 20%");
  });

  it("adds the error class when the inline text represents an error", () => {
    render(<Span isError text="Invalid promo code" />);

    expect(screen.getByText("Invalid promo code")).toHaveClass("span", "span--error");
  });
});
