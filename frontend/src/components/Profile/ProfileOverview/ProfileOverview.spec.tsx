import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProfileOverview } from "./ProfileOverview";

describe("ProfileOverview", () => {
  it("shows customer identity and exposes the two account actions", () => {
    const onChangePassword = vi.fn();
    const onEditProfile = vi.fn();

    render(
      <ProfileOverview
        email="yevhen@example.com"
        firstName="Yevhen"
        lastName="Ryhus"
        onChangePassword={onChangePassword}
        onEditProfile={onEditProfile}
      />
    );

    expect(screen.getByRole("heading", { name: "Yevhen Ryhus" })).toBeVisible();
    expect(screen.getByText("yevhen@example.com")).toBeVisible();
    expect(screen.getByText("YR")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    fireEvent.click(screen.getByRole("button", { name: "Change password" }));

    expect(onEditProfile).toHaveBeenCalledOnce();
    expect(onChangePassword).toHaveBeenCalledOnce();
  });

  it("uses safe fallback identity when names are missing", () => {
    render(
      <ProfileOverview
        email="customer@example.com"
        onChangePassword={() => undefined}
        onEditProfile={() => undefined}
      />
    );

    expect(screen.getByRole("heading", { name: "Sport Gear customer" })).toBeVisible();
    expect(screen.getByText("SG")).toBeVisible();
  });
});
