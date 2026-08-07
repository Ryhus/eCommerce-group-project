import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { CartResponse } from "../../../services/cartService/types";
import { useCart } from "../../context/useCart";
import OrderSummary from "./OrderSummary";

vi.mock("../../context/useCart", () => ({ useCart: vi.fn() }));
vi.mock("./OrderPromoCode/OrderPromoCode", () => ({ default: () => <div>Promo form</div> }));

const cart: CartResponse = {
  id: "cart-id",
  items: [],
  totalQuantity: 2,
  subtotal: { amount: 10000, currency: "EUR" },
  discount: { amount: 1000, currency: "EUR" },
  total: { amount: 9000, currency: "EUR" },
  discountCode: { code: "WELCOME10", description: "10% off your cart" },
};

describe("OrderSummary", () => {
  it("renders only totals calculated by the backend", () => {
    vi.mocked(useCart).mockReturnValue({ cart } as never);
    render(
      <MemoryRouter>
        <OrderSummary />
      </MemoryRouter>
    );

    expect(screen.getByText("Subtotal").parentElement).toHaveTextContent("Subtotal€100.00");
    expect(screen.getByText("Discount").parentElement).toHaveTextContent("Discount-€10.00");
    expect(screen.getByText("Total").parentElement).toHaveTextContent("Total€90.00");
    expect(screen.queryByText("Delivery Fee")).not.toBeInTheDocument();
  });

  it("marks checkout as unavailable and keeps catalog navigation functional", () => {
    vi.mocked(useCart).mockReturnValue({ cart } as never);
    render(
      <MemoryRouter>
        <OrderSummary />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Checkout unavailable" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "Continue shopping" })).toHaveAttribute("href", "/catalog");
  });
});
