import { DiscountType } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { CartsService } from "./carts.service.js";

const service = new CartsService({} as never);

function cart(discountCode: Record<string, unknown> | null) {
  return {
    id: "cart-id",
    discountCode,
    items: [
      {
        id: "item-id",
        variantId: "variant-id",
        quantity: 2,
        variant: {
          productId: "product-id",
          priceAmount: 2500,
          currency: "EUR",
          product: { name: "Ball", images: [{ url: "/ball.jpg" }] },
        },
      },
    ],
  } as never;
}

describe("CartsService totals", () => {
  it("calculates a percentage discount in integer minor units", () => {
    const result = service.toDto(
      cart({
        code: "WELCOME10",
        description: "10% off",
        type: DiscountType.PERCENTAGE,
        percentageBasisPoints: 1000,
        fixedAmount: null,
        minimumSubtotal: 0,
        isActive: true,
        startsAt: null,
        endsAt: null,
      })
    );
    expect(result).toMatchObject({
      totalQuantity: 2,
      subtotal: { amount: 5000 },
      discount: { amount: 500 },
      total: { amount: 4500 },
    });
  });

  it("never discounts below zero", () => {
    const result = service.toDto(
      cart({
        code: "FIXED",
        description: "Large fixed discount",
        type: DiscountType.FIXED_AMOUNT,
        percentageBasisPoints: null,
        fixedAmount: 10000,
        minimumSubtotal: 0,
        isActive: true,
        startsAt: null,
        endsAt: null,
      })
    );
    expect(result.discount.amount).toBe(5000);
    expect(result.total.amount).toBe(0);
  });
});
