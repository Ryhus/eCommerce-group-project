import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import InputField from "./inputField";

describe("InputField", () => {
  it("forwards native input attributes and returns the changed value", () => {
    const handleChange = vi.fn();

    render(
      <InputField
        autoComplete="email"
        name="email"
        onChange={handleChange}
        placeholder="Email address"
        required
        value=""
      />
    );

    const input = screen.getByPlaceholderText("Email address");

    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "false");

    fireEvent.change(input, { target: { value: "shop@example.com" } });
    expect(handleChange).toHaveBeenCalledWith("shop@example.com");
  });

  it("renders icons, custom classes and the invalid state", () => {
    render(
      <InputField
        icon={<svg data-testid="leading-icon" />}
        inputClassName="promo-input"
        isValid={false}
        onChange={vi.fn()}
        rightIcon={<button aria-label="Clear input" type="button" />}
        value="PROMO"
        wrapperClassName="promo-input-wrapper"
      />
    );

    const input = screen.getByDisplayValue("PROMO");
    const wrapper = input.parentElement;

    expect(input).toHaveClass("input", "input--error", "promo-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(wrapper).toHaveClass(
      "input-wrapper--with-leading-icon",
      "input-wrapper--with-trailing-icon",
      "input-wrapper--error",
      "promo-input-wrapper"
    );
    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear input" })).toBeInTheDocument();
  });
});
