import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "../../context/AuthContext";
import { CartContext, type CartContextType } from "../../context/CartContext";
import { HeaderActions } from "./HeaderActions";

const customer = {
  id: "customer-id",
  email: "yevhen@example.com",
  firstName: "Yevhen",
  lastName: "Ryhus",
  dateOfBirth: "1993-05-14",
  addresses: [],
};

function renderActions({ isAuthenticated = false, loading = false, quantity = 0 } = {}) {
  const authValue: AuthContextValue = {
    user: isAuthenticated ? customer : null,
    isAuthenticated,
    loading,
    refreshUser: vi.fn(),
    logout: vi.fn(),
  };
  const cartValue: CartContextType = {
    cart: null,
    cartError: null,
    isCartLoading: false,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateCartQuantity: vi.fn(),
    removeCartItem: vi.fn(),
    calculateTotalQuantity: () => quantity,
    applyPromoCode: vi.fn(),
    removePromoCode: vi.fn(),
    clearCart: vi.fn(),
    refreshCart: vi.fn(),
    setNewCart: vi.fn(),
  };

  render(
    <MemoryRouter>
      <AuthContext value={authValue}>
        <CartContext value={cartValue}>
          <HeaderActions />
        </CartContext>
      </AuthContext>
    </MemoryRouter>
  );
}

describe("HeaderActions", () => {
  it("links anonymous users to login and describes an empty cart", () => {
    renderActions();

    expect(screen.getByRole("link", { name: "Shopping cart, empty" })).toHaveAttribute("href", "/basket");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveTextContent("Sign inYour account");
  });

  it("shows the authenticated customer identity and cart quantity", () => {
    renderActions({ isAuthenticated: true, quantity: 3 });

    expect(screen.getByRole("link", { name: "Shopping cart, 3 items" })).toHaveTextContent("3");
    expect(screen.getByRole("link", { name: "Open Yevhen's account" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Open Yevhen's account" })).toHaveTextContent("YRHi, YevhenMy account");
  });

  it("does not expose the wrong account destination while authentication is loading", () => {
    renderActions({ loading: true });

    expect(screen.getByRole("status", { name: "Checking account status" })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
  });
});
