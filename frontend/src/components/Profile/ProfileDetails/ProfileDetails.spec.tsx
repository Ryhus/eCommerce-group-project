import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProfileDetails } from "./ProfileDetails";

describe("ProfileDetails", () => {
  it("presents labelled personal data and formats the date for reading", () => {
    render(
      <ProfileDetails
        dateOfBirth="1993-05-14"
        email="yevhen@example.com"
        firstName="Yevhen"
        lastName="Ryhus"
        onEdit={() => undefined}
      />
    );

    expect(screen.getByRole("region", { name: "Personal details" })).toBeVisible();
    expect(screen.getByText("Yevhen")).toBeVisible();
    expect(screen.getByText("Ryhus")).toBeVisible();
    expect(screen.getByText("yevhen@example.com")).toBeVisible();
    expect(screen.getByText("14 May 1993")).toBeVisible();
  });

  it("uses readable fallbacks and forwards the edit action", () => {
    const onEdit = vi.fn();
    render(<ProfileDetails dateOfBirth="invalid" email="customer@example.com" onEdit={onEdit} />);

    expect(screen.getAllByText("Not provided")).toHaveLength(2);
    expect(screen.getByText("invalid")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Edit personal details" }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});
