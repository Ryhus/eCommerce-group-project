import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import i18n from "../../../i18n/i18n";

import { ProductGallery } from "./ProductGallery";

describe("ProductGallery", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("changes the active image from an accessible thumbnail", () => {
    render(<ProductGallery images={["front.jpg", "back.jpg"]} productName="Training shirt" />);

    fireEvent.click(screen.getByRole("button", { name: "View Training shirt image 2" }));

    expect(screen.getByRole("button", { name: "View Training shirt image 2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img", { name: "Training shirt, image 2 of 2" })).toHaveAttribute("src", "back.jpg");
  });

  it("opens an enlarged image and closes it with Escape", () => {
    const { container } = render(<ProductGallery images={["shirt.jpg"]} productName="Training shirt" />);

    expect(container.firstChild).toHaveClass("product-gallery--single");
    expect(screen.queryByRole("button", { name: /View Training shirt image/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Expand Training shirt, image 1 of 1" }));
    expect(screen.getByRole("dialog", { name: "Training shirt enlarged image" })).toBeVisible();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("localizes gallery and dialog controls", async () => {
    await i18n.changeLanguage("de");
    render(<ProductGallery images={["front.jpg", "back.jpg"]} productName="Training shirt" />);

    expect(screen.getByRole("region", { name: "Bilder von Training shirt" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Bild 2 von Training shirt anzeigen" }));
    expect(screen.getByRole("img", { name: "Training shirt, Bild 2 von 2" })).toHaveAttribute("src", "back.jpg");

    fireEvent.click(screen.getByRole("button", { name: "Training shirt, Bild 2 von 2 vergrößern" }));
    expect(screen.getByRole("dialog", { name: "Vergrößertes Bild von Training shirt" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Vergrößertes Bild schließen" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
