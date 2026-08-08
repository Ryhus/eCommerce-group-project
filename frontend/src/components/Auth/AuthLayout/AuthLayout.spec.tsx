import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("presents the supplied form without an adjacent visual panel", () => {
    render(
      <AuthLayout>
        <form aria-label="Example authentication form" />
      </AuthLayout>
    );

    expect(screen.getByRole("form", { name: "Example authentication form" })).toBeVisible();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(document.querySelector(".auth-layout__panel")).not.toBeInTheDocument();
  });
});
