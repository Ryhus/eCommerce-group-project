import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthFormField } from "./AuthFormField";

describe("AuthFormField", () => {
  it("associates its label and stable error region with a control", () => {
    const { rerender } = render(
      <AuthFormField inputId="email" label="Email address">
        <input id="email" />
      </AuthFormField>
    );

    expect(screen.getByLabelText("Email address")).toHaveAttribute("id", "email");
    expect(document.querySelector("#email-error")).toBeEmptyDOMElement();

    rerender(
      <AuthFormField error="Enter a valid email." inputId="email" label="Email address">
        <input id="email" />
      </AuthFormField>
    );

    expect(document.querySelector("#email-error")).toHaveTextContent("Enter a valid email.");
  });
});
