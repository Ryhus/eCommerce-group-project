import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "../context/AuthContext";
import { CartContext, type CartContextType } from "../context/CartContext";
import Header from "./Header";

const authValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  loading: false,
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
  calculateTotalQuantity: () => 0,
  applyPromoCode: vi.fn(),
  removePromoCode: vi.fn(),
  clearCart: vi.fn(),
  refreshCart: vi.fn(),
  setNewCart: vi.fn(),
};

function renderHeader() {
  return render(
    <MemoryRouter>
      <AuthContext value={authValue}>
        <CartContext value={cartValue}>
          <Header />
        </CartContext>
      </AuthContext>
    </MemoryRouter>
  );
}

afterEach(() => document.body.classList.remove("no-scroll"));

describe("Header", () => {
  it("composes the storefront logo, navigation, search and actions", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "Sport Gear home" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("search", { name: "Product search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Current language: English" })).toHaveTextContent("EN");
    expect(screen.getByRole("link", { name: "Shopping cart, empty" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("opens one mobile panel at a time and manages scroll locking", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.body).toHaveClass("no-scroll");
    expect(screen.getAllByRole("navigation", { name: "Primary navigation" })).toHaveLength(2);
    expect(screen.getByText("Language")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open search" }));

    expect(screen.getByRole("button", { name: "Close search" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveClass("no-scroll");
    expect(screen.getAllByRole("search", { name: "Product search" })).toHaveLength(2);
  });
});
