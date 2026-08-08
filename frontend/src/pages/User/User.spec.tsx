import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../components/context/useAuth";
import { useCart } from "../../components/context/useCart";
import type { CustomerResponse } from "../../services/customerService/types";
import UserPage from "./User";

const navigate = vi.fn();
const logout = vi.fn();
const refreshCart = vi.fn();
const setNewCart = vi.fn();

const customer: CustomerResponse = {
  id: "customer-id",
  email: "yevhen@example.com",
  firstName: "Yevhen",
  lastName: "Ryhus",
  dateOfBirth: "1993-05-14",
  addresses: [],
  shippingAddressIds: [],
  billingAddressIds: [],
  defaultBillingAddressId: null,
  defaultShippingAddressId: null,
};

vi.mock("react-router-dom", () => ({
  useLoaderData: () => customer,
  useNavigate: () => navigate,
}));

vi.mock("../../components/context/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../../components/context/useCart", () => ({ useCart: vi.fn() }));
vi.mock("../../components/UserInfo/UserInfo", () => ({
  UserInfo: ({ onLogout }: { onLogout: () => Promise<void> }) => (
    <button onClick={() => void onLogout()} type="button">
      Log out
    </button>
  ),
}));

describe("UserPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logout.mockResolvedValue(undefined);
    refreshCart.mockResolvedValue(undefined);
    vi.mocked(useAuth).mockReturnValue({ logout } as never);
    vi.mocked(useCart).mockReturnValue({ refreshCart, setNewCart } as never);
  });

  it("removes the authenticated cart immediately after a successful logout", async () => {
    render(<UserPage />);

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(logout).toHaveBeenCalledOnce());
    await waitFor(() => expect(setNewCart).toHaveBeenCalledWith(null));
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
    expect(refreshCart).toHaveBeenCalledOnce();
  });
});
