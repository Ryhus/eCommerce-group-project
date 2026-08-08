import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProfilePasswordForm } from "./ProfilePasswordForm";

function renderForm(action = vi.fn()) {
  const onCancel = vi.fn();
  const onSuccess = vi.fn();
  const router = createMemoryRouter(
    [
      {
        path: "/profile",
        action,
        element: <ProfilePasswordForm onCancel={onCancel} onSuccess={onSuccess} />,
      },
    ],
    { initialEntries: ["/profile"] }
  );

  render(<RouterProvider router={router} />);
  return { action, onCancel, onSuccess };
}

function fillPasswords() {
  fireEvent.change(screen.getByLabelText("Current password"), { target: { value: "Current_Pass1" } });
  fireEvent.change(screen.getByLabelText("New password"), { target: { value: "New_Strong1" } });
}

describe("ProfilePasswordForm", () => {
  it("validates both password fields before submission", async () => {
    const { action } = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Change password" }));

    expect(await screen.findByText("Enter your current password.")).toBeVisible();
    expect(screen.getByText("Password must be at least 8 characters.")).toBeVisible();
    await waitFor(() => expect(screen.getByLabelText("Current password")).toHaveFocus());
    expect(action).not.toHaveBeenCalled();
  });

  it("controls current and new password visibility independently", () => {
    renderForm();
    const currentPassword = screen.getByLabelText("Current password");
    const newPassword = screen.getByLabelText("New password");
    const visibilityButtons = screen.getAllByRole("button", { name: "Show password" });

    fireEvent.click(visibilityButtons[0]);
    expect(currentPassword).toHaveAttribute("type", "text");
    expect(newPassword).toHaveAttribute("type", "password");
  });

  it("submits the password action and reports success", async () => {
    const action = vi.fn().mockResolvedValue({
      id: "customer-id",
      email: "yevhen@example.com",
      dateOfBirth: "1993-05-14",
      addresses: [],
    });
    const { onSuccess } = renderForm(action);
    fillPasswords();

    fireEvent.click(screen.getByRole("button", { name: "Change password" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce(), { timeout: 3000 });
  });
});
