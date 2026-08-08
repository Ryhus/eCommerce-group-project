import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProfileSecurity } from "./ProfileSecurity";

describe("ProfileSecurity", () => {
  it("explains the password setting and forwards its action", () => {
    const onChangePassword = vi.fn();
    render(<ProfileSecurity onChangePassword={onChangePassword} />);

    const section = screen.getByRole("region", { name: "Security" });
    expect(section).toContainElement(screen.getByRole("heading", { name: "Password" }));
    expect(section).toHaveTextContent("Use a strong, unique password");

    fireEvent.click(screen.getByRole("button", { name: "Change" }));
    expect(onChangePassword).toHaveBeenCalledOnce();
  });
});
