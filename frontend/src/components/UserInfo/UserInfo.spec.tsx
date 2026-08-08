import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateCustomer } from "../../services/customerService/customerService";
import { UserInfo } from "./UserInfo";

vi.mock("../../services/customerService/customerService", () => ({ updateCustomer: vi.fn() }));

const updateCustomerMock = vi.mocked(updateCustomer);
const onLogout = vi.fn();

function renderProfile() {
  const router = createMemoryRouter(
    [
      {
        path: "/profile",
        action: () => null,
        element: (
          <UserInfo
            adresses={[
              {
                id: "address-id",
                streetName: "10 Main Street",
                city: "Berlin",
                postalCode: "10115",
                country: "DE",
              },
            ]}
            billingAddressIds={["address-id"]}
            dateOfBirth="1993-05-14"
            defaultBillingAddressId="address-id"
            defaultShippingAddressId="address-id"
            email="yevhen@example.com"
            firstName="Yevhen"
            lastName="Ryhus"
            onLogout={onLogout}
            shippingAddressIds={["address-id"]}
          />
        ),
      },
    ],
    { initialEntries: ["/profile"] }
  );

  return render(<RouterProvider router={router} />);
}

describe("UserInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateCustomerMock.mockResolvedValue({} as never);
  });

  it("renders the complete single-page account layout", () => {
    renderProfile();

    expect(screen.getByRole("heading", { level: 1, name: "My account" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Yevhen Ryhus" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Personal details" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Security" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Saved addresses" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("HomeMy account");
  });

  it("opens and cancels each editor without leaving the page", () => {
    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("region", { name: "Edit personal details" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    fireEvent.click(screen.getAllByRole("button", { name: "Change password" })[0]);
    expect(screen.getByRole("region", { name: "Change password" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    fireEvent.click(screen.getByRole("button", { name: "Add address" }));
    expect(screen.getByRole("region", { name: "Add address" })).toBeVisible();
  });

  it("requires confirmation before deleting through the customer service", async () => {
    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: "Delete 10 Main Street" }));
    expect(screen.getByRole("alertdialog", { name: "Delete address?" })).toBeVisible();
    expect(updateCustomerMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Delete address" }));

    await waitFor(() => expect(updateCustomerMock).toHaveBeenCalledWith({ removeAddressId: "address-id" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(), { timeout: 3000 });
  });

  it("forwards logout from the page header", () => {
    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(onLogout).toHaveBeenCalledOnce();
  });
});
