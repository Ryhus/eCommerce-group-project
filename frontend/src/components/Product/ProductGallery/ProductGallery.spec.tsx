import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductGallery } from "./ProductGallery";

describe("ProductGallery", () => {
  it("changes the active image from an accessible thumbnail", () => {
    render(<ProductGallery images={["front.jpg", "back.jpg"]} productName="Training shirt" />);

    fireEvent.click(screen.getByRole("button", { name: "View Training shirt image 2" }));

    expect(screen.getByRole("button", { name: "View Training shirt image 2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img", { name: "Training shirt, image 2 of 2" })).toHaveAttribute("src", "back.jpg");
  });

  it("opens an enlarged image and closes it with Escape", () => {
    render(<ProductGallery images={["shirt.jpg"]} productName="Training shirt" />);

    expect(screen.queryByRole("button", { name: /View Training shirt image/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Expand Training shirt, image 1 of 1" }));
    expect(screen.getByRole("dialog", { name: "Training shirt enlarged image" })).toBeVisible();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
