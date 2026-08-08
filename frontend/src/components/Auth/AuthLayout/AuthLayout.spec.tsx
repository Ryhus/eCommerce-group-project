import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("presents account context alongside the supplied form", () => {
    render(
      <AuthLayout panelDescription="Pick up where you left off." panelTitle="KEEP MOVING.">
        <form aria-label="Example authentication form" />
      </AuthLayout>
    );

    const panel = screen.getByRole("complementary", { name: "Sport Gear account benefits" });
    expect(panel).toHaveTextContent("KEEP MOVING.");
    expect(panel).toHaveTextContent("Pick up where you left off.");
    expect(screen.getByRole("form", { name: "Example authentication form" })).toBeVisible();
  });
});
