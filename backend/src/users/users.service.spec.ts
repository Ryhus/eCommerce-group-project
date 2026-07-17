import { ConflictException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it, vi } from "vitest";
import { CreateAddressDto } from "./dto/address.dto.js";
import { ChangePasswordDto } from "./dto/change-password.dto.js";
import { UsersService } from "./users.service.js";

const validAddress = {
  streetName: "Test Street 1",
  city: "Berlin",
  postalCode: "10115",
  country: "DE",
  isShipping: true,
  isBilling: true,
  isDefaultShipping: false,
  isDefaultBilling: false,
};

describe("UsersService validation and address rules", () => {
  it("rejects users younger than 13 before accessing the database", async () => {
    const prisma = { user: { findUnique: vi.fn() } };
    const service = new UsersService(prisma as never);

    await expect(
      service.create({
        email: "child@example.com",
        password: "Strong!Pass1",
        firstName: "Test",
        lastName: "Child",
        dateOfBirth: new Date().toISOString().slice(0, 10),
        address: validAddress,
        useAsDefaultAddress: false,
      })
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("validates strong passwords and ISO country addresses", async () => {
    const password = plainToInstance(ChangePasswordDto, { currentPassword: "old", newPassword: "weak" });
    const address = plainToInstance(CreateAddressDto, { ...validAddress, country: "Germany", postalCode: "1" });

    expect(await validate(password)).not.toHaveLength(0);
    expect(await validate(address)).not.toHaveLength(0);
  });

  it("resets the previous default shipping address transactionally", async () => {
    const transaction = {
      address: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        update: vi.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      address: { findFirst: vi.fn().mockResolvedValue({ id: "address-id" }) },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "user-id",
          email: "test@example.com",
          passwordHash: "hash",
          firstName: "Test",
          lastName: "User",
          dateOfBirth: new Date("1990-01-01"),
          addresses: [],
        }),
      },
      $transaction: vi.fn(async (callback: (tx: typeof transaction) => Promise<void>) => callback(transaction)),
    };

    await new UsersService(prisma as never).updateAddress("user-id", "address-id", { isDefaultShipping: true });

    expect(transaction.address.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-id", isDefaultShipping: true },
      data: { isDefaultShipping: false },
    });
    expect(transaction.address.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isDefaultShipping: true, isShipping: true }) })
    );
  });
});
