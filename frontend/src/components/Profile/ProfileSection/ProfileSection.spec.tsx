import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileSection } from "./ProfileSection";

describe("ProfileSection", () => {
  it("connects the section to its heading and renders optional supporting content", () => {
    render(
      <ProfileSection action={<button type="button">Edit</button>} description="Supporting copy" title="Details">
        <p>Section content</p>
      </ProfileSection>
    );

    const section = screen.getByRole("region", { name: "Details" });
    expect(section).toContainElement(screen.getByText("Supporting copy"));
    expect(section).toContainElement(screen.getByText("Section content"));
    expect(section).toContainElement(screen.getByRole("button", { name: "Edit" }));
  });
});
