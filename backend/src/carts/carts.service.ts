import { randomBytes } from "node:crypto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CartStatus, DiscountType, type Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";

const cartInclude = {
  discountCode: true,
  items: {
    orderBy: { createdAt: "asc" as const },
    include: {
      variant: {
        include: {
          product: { include: { images: { orderBy: { sortOrder: "asc" as const }, take: 1 } } },
        },
      },
    },
  },
};

type CartEntity = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export interface CartContextResult {
  cart: ReturnType<CartsService["toDto"]>;
  anonymousKey?: string;
}

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(userId?: string, anonymousKey?: string): Promise<CartContextResult> {
    if (userId) {
      const cart = await this.prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
        include: cartInclude,
      });
      return { cart: this.toDto(cart) };
    }

    if (anonymousKey) {
      const existing = await this.prisma.cart.findFirst({
        where: { anonymousKey, status: CartStatus.ACTIVE, userId: null },
        include: cartInclude,
      });
      if (existing) return { cart: this.toDto(existing), anonymousKey };
    }

    const newKey = randomBytes(32).toString("base64url");
    const cart = await this.prisma.cart.create({ data: { anonymousKey: newKey }, include: cartInclude });
    return { cart: this.toDto(cart), anonymousKey: newKey };
  }

  async addItem(userId: string | undefined, anonymousKey: string | undefined, productId: string, quantity: number) {
    const context = await this.getOrCreate(userId, anonymousKey);
    const variant = await this.prisma.productVariant.findUnique({
      where: { productId },
      include: { product: true },
    });
    if (!variant?.product.isActive) throw new NotFoundException("Product not found");
    await this.prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: context.cart.id, variantId: variant.id } },
      update: { quantity: { increment: quantity } },
      create: { cartId: context.cart.id, variantId: variant.id, quantity },
    });
    return this.reload(context.cart.id, context.anonymousKey);
  }

  async updateItem(userId: string | undefined, anonymousKey: string | undefined, itemId: string, quantity: number) {
    const context = await this.getOrCreate(userId, anonymousKey);
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cartId: context.cart.id } });
    if (!item) throw new NotFoundException("Cart item not found");
    await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    return this.reload(context.cart.id, context.anonymousKey);
  }

  async deleteItem(userId: string | undefined, anonymousKey: string | undefined, itemId: string) {
    const context = await this.getOrCreate(userId, anonymousKey);
    const result = await this.prisma.cartItem.deleteMany({ where: { id: itemId, cartId: context.cart.id } });
    if (!result.count) throw new NotFoundException("Cart item not found");
    return this.reload(context.cart.id, context.anonymousKey);
  }

  async clear(userId?: string, anonymousKey?: string) {
    const context = await this.getOrCreate(userId, anonymousKey);
    await this.prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId: context.cart.id } });
      await tx.cart.update({ where: { id: context.cart.id }, data: { discountCodeId: null } });
    });
    return this.reload(context.cart.id, context.anonymousKey);
  }

  async applyDiscount(userId: string | undefined, anonymousKey: string | undefined, rawCode: string) {
    const context = await this.getOrCreate(userId, anonymousKey);
    const code = await this.prisma.discountCode.findUnique({ where: { code: rawCode.trim().toUpperCase() } });
    if (!code || !this.isPromotionValid(code)) throw new BadRequestException("Discount code is invalid or inactive");
    if (context.cart.subtotal.amount < code.minimumSubtotal) {
      throw new BadRequestException("Cart subtotal does not meet this discount minimum");
    }
    await this.prisma.cart.update({ where: { id: context.cart.id }, data: { discountCodeId: code.id } });
    return this.reload(context.cart.id, context.anonymousKey);
  }

  async removeDiscount(userId?: string, anonymousKey?: string) {
    const context = await this.getOrCreate(userId, anonymousKey);
    await this.prisma.cart.update({ where: { id: context.cart.id }, data: { discountCodeId: null } });
    return this.reload(context.cart.id, context.anonymousKey);
  }

  async mergeAnonymousCart(userId: string, anonymousKey?: string) {
    if (!anonymousKey) return (await this.getOrCreate(userId)).cart;
    const anonymousCart = await this.prisma.cart.findFirst({
      where: { anonymousKey, status: CartStatus.ACTIVE, userId: null },
      include: { items: true, discountCode: true },
    });
    if (!anonymousCart) return (await this.getOrCreate(userId)).cart;

    const cartId = await this.prisma.$transaction(async (tx) => {
      const userCart = await tx.cart.findUnique({ where: { userId }, include: { discountCode: true } });
      if (!userCart) {
        const attached = await tx.cart.update({
          where: { id: anonymousCart.id },
          data: { userId, anonymousKey: null },
        });
        return attached.id;
      }

      for (const item of anonymousCart.items) {
        await tx.cartItem.upsert({
          where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
          update: { quantity: { increment: item.quantity } },
          create: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity },
        });
      }
      const canMoveDiscount =
        !userCart.discountCodeId && anonymousCart.discountCode && this.isPromotionValid(anonymousCart.discountCode);
      if (canMoveDiscount) {
        await tx.cart.update({ where: { id: userCart.id }, data: { discountCodeId: anonymousCart.discountCodeId } });
      }
      await tx.cartItem.deleteMany({ where: { cartId: anonymousCart.id } });
      await tx.cart.update({
        where: { id: anonymousCart.id },
        data: { status: CartStatus.MERGED, discountCodeId: null },
      });
      return userCart.id;
    });

    return (await this.reload(cartId)).cart;
  }

  private async reload(cartId: string, anonymousKey?: string): Promise<CartContextResult> {
    const cart = await this.prisma.cart.findUniqueOrThrow({ where: { id: cartId }, include: cartInclude });
    return { cart: this.toDto(cart), anonymousKey };
  }

  toDto(cart: CartEntity) {
    const items = cart.items.map((item) => {
      const amount = item.variant.priceAmount;
      return {
        id: item.id,
        productId: item.variant.productId,
        variantId: item.variantId,
        name: item.variant.product.name,
        image: item.variant.product.images[0]?.url ?? null,
        quantity: item.quantity,
        unitPrice: { amount, currency: item.variant.currency },
        lineTotal: { amount: amount * item.quantity, currency: item.variant.currency },
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal.amount, 0);
    const discount = this.calculateDiscount(cart, subtotal);
    return {
      id: cart.id,
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: { amount: subtotal, currency: "EUR" as const },
      discount: { amount: discount, currency: "EUR" as const },
      total: { amount: Math.max(0, subtotal - discount), currency: "EUR" as const },
      discountCode: cart.discountCode
        ? { code: cart.discountCode.code, description: cart.discountCode.description }
        : null,
    };
  }

  private calculateDiscount(cart: CartEntity, subtotal: number) {
    const code = cart.discountCode;
    if (!code || !this.isPromotionValid(code) || subtotal < code.minimumSubtotal) return 0;
    if (code.type === DiscountType.PERCENTAGE) {
      return Math.min(subtotal, Math.floor((subtotal * (code.percentageBasisPoints ?? 0)) / 10_000));
    }
    return Math.min(subtotal, code.fixedAmount ?? 0);
  }

  private isPromotionValid(code: { isActive: boolean; startsAt: Date | null; endsAt: Date | null }) {
    const now = new Date();
    return code.isActive && (!code.startsAt || code.startsAt <= now) && (!code.endsAt || code.endsAt >= now);
  }
}
