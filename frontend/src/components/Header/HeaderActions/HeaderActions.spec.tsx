import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "../../context/AuthContext";
import { CartContext, type CartContextType } from "../../context/CartContext";
import { HeaderActions } from "./HeaderActions";

function renderActions({ isAuthenticated = false, quantity = 0 } = {}) {
  const authValue: AuthContextValue = {
    user: null,
    isAuthenticated,
    loading: false,
    refreshUser: vi.fn(),
    logout: vi.fn(),
  };
  const cartValue: CartContextType = {
    cart: null,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    calculateTotalQuantity: () => quantity,
    applyPromoCode: vi.fn(),
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
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("links authenticated users to profile and displays the cart quantity", () => {
    renderActions({ isAuthenticated: true, quantity: 3 });

    expect(screen.getByRole("link", { name: "Shopping cart, 3 items" })).toHaveTextContent("3");
    expect(screen.getByRole("link", { name: "Open profile" })).toHaveAttribute("href", "/profile");
  });
});
