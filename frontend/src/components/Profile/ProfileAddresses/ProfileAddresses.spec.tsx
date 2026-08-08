import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Address } from "../../../services/customerService/types";
import { ProfileAddresses } from "./ProfileAddresses";

const homeAddress: Address = {
  id: "home",
  streetName: "10 Main Street",
  postalCode: "10115",
  city: "Berlin",
  country: "DE",
};

describe("ProfileAddresses", () => {
  it("shows each address once with its roles and forwards row actions", () => {
    const onAdd = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <ProfileAddresses
        addresses={[homeAddress]}
        billingAddressIds={["home"]}
        defaultBillingAddressId="home"
        defaultShippingAddressId="home"
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        shippingAddressIds={["home"]}
      />
    );

    const section = screen.getByRole("region", { name: "Saved addresses" });
    expect(within(section).getByRole("listitem")).toHaveTextContent("10 Main Street");
    expect(within(section).getByText("10115 Berlin, Germany")).toBeVisible();
    expect(within(section).getByText("Default shipping")).toBeVisible();
    expect(within(section).getByText("Default billing")).toBeVisible();

    fireEvent.click(within(section).getByRole("button", { name: "Add address" }));
    fireEvent.click(within(section).getByRole("button", { name: "Edit 10 Main Street" }));
    fireEvent.click(within(section).getByRole("button", { name: "Delete 10 Main Street" }));

    expect(onAdd).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(homeAddress);
    expect(onDelete).toHaveBeenCalledWith(homeAddress);
  });

  it("shows a useful empty state", () => {
    render(
      <ProfileAddresses addresses={[]} onAdd={() => undefined} onDelete={() => undefined} onEdit={() => undefined} />
    );

    expect(screen.getByRole("heading", { name: "No saved addresses yet" })).toBeVisible();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
