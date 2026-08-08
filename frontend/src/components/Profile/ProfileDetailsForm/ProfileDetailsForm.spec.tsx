import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProfileDetailsForm } from "./ProfileDetailsForm";

function renderForm(action = vi.fn()) {
  const onCancel = vi.fn();
  const onSuccess = vi.fn();
  const router = createMemoryRouter(
    [
      {
        path: "/profile",
        action,
        element: (
          <ProfileDetailsForm
            dateOfBirth="1993-05-14"
            email="yevhen@example.com"
            firstName="Yevhen"
            lastName="Ryhus"
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        ),
      },
    ],
    { initialEntries: ["/profile"] }
  );

  render(<RouterProvider router={router} />);
  return { action, onCancel, onSuccess };
}

describe("ProfileDetailsForm", () => {
  it("keeps its error regions stable and prevents invalid submission", async () => {
    const { action } = renderForm();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "invalid" } });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText(/must contain an '@' symbol/i)).toBeVisible();
    await waitFor(() => expect(screen.getByLabelText("Email address")).toHaveFocus());
    expect(action).not.toHaveBeenCalled();
    expect(document.querySelector("#profile-first-name-error")).toBeInTheDocument();
  });

  it("submits the profile action and reports success", async () => {
    const action = vi.fn().mockResolvedValue({
      id: "customer-id",
      email: "yevhen@example.com",
      firstName: "Yevhen",
      lastName: "Ryhus",
      dateOfBirth: "1993-05-14",
      addresses: [],
    });
    const { onSuccess } = renderForm(action);

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce(), { timeout: 3000 });
  });

  it("cancels without submitting", () => {
    const { action, onCancel } = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(action).not.toHaveBeenCalled();
  });
});
