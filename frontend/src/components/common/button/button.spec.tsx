import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./button";

describe("Button", () => {
  it("renders the dark variant by default and handles clicks", () => {
    const handleClick = vi.fn();

    render(<Button name="shop" onClick={handleClick} text="Shop now" />);

    const button = screen.getByRole("button", { name: "Shop now" });

    expect(button).toHaveClass("btn", "btn--dark");
    expect(button).toHaveAttribute("name", "shop");
    expect(button).toHaveAttribute("type", "button");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("renders the light variant, icon and disabled state", () => {
    const handleClick = vi.fn();

    render(
      <Button
        disabled
        icon={<svg aria-label="Edit icon" />}
        onClick={handleClick}
        text="Edit profile"
        variant="light"
      />
    );

    const button = screen.getByRole("button", { name: "Edit icon Edit profile" });

    expect(button).toHaveClass("btn--light", "btn--disabled");
    expect(button).toBeDisabled();
    expect(button.querySelector(".button-icon")).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
