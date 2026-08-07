import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CartResponse } from "../../../../services/cartService/types";
import { useCart } from "../../../context/useCart";
import OrderPromoCode from "./OrderPromoCode";

vi.mock("../../../context/useCart", () => ({ useCart: vi.fn() }));

const cart: CartResponse = {
  id: "cart-id",
  items: [],
  totalQuantity: 0,
  subtotal: { amount: 5000, currency: "EUR" },
  discount: { amount: 500, currency: "EUR" },
  total: { amount: 4500, currency: "EUR" },
  discountCode: null,
};

describe("OrderPromoCode", () => {
  const applyPromoCode = vi.fn();
  const removePromoCode = vi.fn();

  beforeEach(() => {
    applyPromoCode.mockReset();
    removePromoCode.mockReset();
    applyPromoCode.mockResolvedValue(undefined);
    removePromoCode.mockResolvedValue(undefined);
    vi.mocked(useCart).mockReturnValue({ cart, applyPromoCode, removePromoCode } as never);
  });

  it("normalizes and applies a promo code", async () => {
    render(<OrderPromoCode />);

    fireEvent.change(screen.getByRole("textbox", { name: "Promo code" }), { target: { value: " welcome10 " } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => expect(applyPromoCode).toHaveBeenCalledWith("WELCOME10"));
    expect(screen.getByRole("textbox", { name: "Promo code" })).toHaveValue("");
  });

  it("explains an empty promo code", async () => {
    render(<OrderPromoCode />);

    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a promo code");
    expect(applyPromoCode).not.toHaveBeenCalled();
  });

  it("shows and removes the applied promo code", async () => {
    vi.mocked(useCart).mockReturnValue({
      cart: { ...cart, discountCode: { code: "WELCOME10", description: "10% off your cart" } },
      applyPromoCode,
      removePromoCode,
    } as never);
    render(<OrderPromoCode />);

    expect(screen.getByLabelText("Applied promo code")).toHaveTextContent("WELCOME10");
    fireEvent.click(screen.getByRole("button", { name: "Remove promo code WELCOME10" }));

    await waitFor(() => expect(removePromoCode).toHaveBeenCalledOnce());
  });
});
