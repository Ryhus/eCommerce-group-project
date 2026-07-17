import { CartStatus, DiscountType } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
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

describe("CartsService anonymous cart merge", () => {
  it("adds matching quantities and keeps the user cart discount", async () => {
    const anonymousDiscount = {
      code: "ANON10",
      description: "Anonymous discount",
      type: DiscountType.PERCENTAGE,
      percentageBasisPoints: 1000,
      fixedAmount: null,
      minimumSubtotal: 0,
      isActive: true,
      startsAt: null,
      endsAt: null,
    };
    const transaction = {
      cart: {
        findUnique: vi.fn().mockResolvedValue({
          id: "user-cart",
          discountCodeId: "user-discount",
          discountCode: { id: "user-discount" },
        }),
        update: vi.fn().mockResolvedValue({ id: "anonymous-cart" }),
      },
      cartItem: {
        upsert: vi.fn().mockResolvedValue({}),
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const prisma = {
      cart: {
        findFirst: vi.fn().mockResolvedValue({
          id: "anonymous-cart",
          items: [{ variantId: "variant-id", quantity: 2 }],
          discountCodeId: "anonymous-discount",
          discountCode: anonymousDiscount,
        }),
        findUniqueOrThrow: vi.fn().mockResolvedValue({ ...cart(null), id: "user-cart" }),
      },
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<string>) => callback(transaction)),
    };

    const result = await new CartsService(prisma as never).mergeAnonymousCart("user-id", "anonymous-key");

    expect(transaction.cartItem.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { cartId_variantId: { cartId: "user-cart", variantId: "variant-id" } },
        update: { quantity: { increment: 2 } },
      })
    );
    expect(transaction.cart.update).toHaveBeenCalledTimes(1);
    expect(transaction.cart.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: CartStatus.MERGED }) })
    );
    expect(result.id).toBe("user-cart");
  });
});
