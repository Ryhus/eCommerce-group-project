import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Paragraph from "./paragraph";

describe("Paragraph", () => {
  it("renders text and forwards native paragraph attributes", () => {
    render(
      <Paragraph
        aria-label="Product description"
        className="product-description"
        id="description"
        text="Designed for everyday comfort."
      />
    );

    const paragraph = screen.getByLabelText("Product description");

    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveClass("paragraph", "product-description");
    expect(paragraph).toHaveAttribute("id", "description");
    expect(paragraph).toHaveTextContent("Designed for everyday comfort.");
  });

  it("adds the error class when the paragraph represents an error", () => {
    render(<Paragraph isError text="Email is required" />);

    expect(screen.getByText("Email is required")).toHaveClass("paragraph", "paragraph--error");
  });
});
