import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { Address } from "../../../services/customerService/types";
import { ProfileAddressForm } from "./ProfileAddressForm";

const existingAddress: Address = {
  id: "address-id",
  streetName: "10 Main Street",
  city: "Berlin",
  postalCode: "10115",
  country: "DE",
  isDefaultShipping: true,
};

function renderForm(address?: Address, action = vi.fn()) {
  const onCancel = vi.fn();
  const onSuccess = vi.fn();
  const router = createMemoryRouter(
    [
      {
        path: "/profile",
        action,
        element: <ProfileAddressForm address={address} onCancel={onCancel} onSuccess={onSuccess} />,
      },
    ],
    { initialEntries: ["/profile"] }
  );

  render(<RouterProvider router={router} />);
  return { action, onCancel, onSuccess };
}

describe("ProfileAddressForm", () => {
  it("pre-fills an existing address and its default role", () => {
    renderForm(existingAddress);

    expect(screen.getByLabelText("Street address")).toHaveValue("10 Main Street");
    expect(screen.getByLabelText("City")).toHaveValue("Berlin");
    expect(screen.getByLabelText("Postal code")).toHaveValue("10115");
    expect(screen.getByLabelText("Country")).toHaveValue("DE");
    expect(screen.getByRole("checkbox", { name: "Use as default shipping address" })).toBeChecked();
  });

  it("prevents an empty address submission and focuses its first field", async () => {
    const { action } = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Save address" }));

    expect(await screen.findByText("Street is required.")).toBeVisible();
    await waitFor(() => expect(screen.getByLabelText("Street address")).toHaveFocus());
    expect(action).not.toHaveBeenCalled();
  });

  it("submits a valid address and reports success", async () => {
    const action = vi.fn().mockResolvedValue({
      id: "customer-id",
      email: "customer@example.com",
      dateOfBirth: "1993-05-14",
      addresses: [existingAddress],
    });
    const { onSuccess } = renderForm(existingAddress, action);

    fireEvent.click(screen.getByRole("button", { name: "Save address" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });
});
