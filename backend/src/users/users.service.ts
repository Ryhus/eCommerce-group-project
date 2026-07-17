import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { hash, verify } from "argon2";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service.js";
import type { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto.js";
import type { ChangePasswordDto } from "./dto/change-password.dto.js";
import type { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { toUserDto } from "./user.mapper.js";

interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: CreateAddressDto;
  useAsDefaultAddress: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() }, include: { addresses: true } });
  }

  async getEntity(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { addresses: true } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getDto(userId: string) {
    return toUserDto(await this.getEntity(userId));
  }

  async create(input: CreateUserInput) {
    this.ensureMinimumAge(input.dateOfBirth);
    if (await this.findByEmail(input.email)) throw new ConflictException("Email is already registered");
    const makeDefault = input.useAsDefaultAddress;
    try {
      return await this.prisma.user.create({
        data: {
          email: input.email.trim().toLowerCase(),
          passwordHash: await hash(input.password),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          dateOfBirth: new Date(input.dateOfBirth),
          addresses: {
            create: {
              streetName: input.address.streetName,
              city: input.address.city,
              postalCode: input.address.postalCode,
              country: input.address.country,
              isShipping: true,
              isBilling: true,
              isDefaultShipping: makeDefault,
              isDefaultBilling: makeDefault,
            },
          },
        },
        include: { addresses: true },
      });
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") throw new ConflictException("Email is already registered");
      throw error;
    }
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    if (input.dateOfBirth) this.ensureMinimumAge(input.dateOfBirth);
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...input,
          ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
          ...(input.dateOfBirth ? { dateOfBirth: new Date(input.dateOfBirth) } : {}),
        },
        include: { addresses: true },
      });
      return toUserDto(user);
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") throw new ConflictException("Email is already registered");
      throw error;
    }
  }

  async changePassword(userId: string, input: ChangePasswordDto) {
    const user = await this.getEntity(userId);
    if (!(await verify(user.passwordHash, input.currentPassword))) {
      throw new UnauthorizedException("Current password is incorrect");
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await hash(input.newPassword) },
      include: { addresses: true },
    });
  }

  async createAddress(userId: string, input: CreateAddressDto) {
    await this.prisma.$transaction(async (tx) => {
      await this.resetDefaults(tx, userId, input);
      await tx.address.create({
        data: {
          ...input,
          userId,
          isShipping: input.isShipping || input.isDefaultShipping,
          isBilling: input.isBilling || input.isDefaultBilling,
        },
      });
    });
    return this.getDto(userId);
  }

  async updateAddress(userId: string, addressId: string, input: UpdateAddressDto) {
    await this.assertAddressOwner(userId, addressId);
    await this.prisma.$transaction(async (tx) => {
      await this.resetDefaults(tx, userId, input);
      await tx.address.update({
        where: { id: addressId },
        data: {
          ...input,
          ...(input.isDefaultShipping ? { isShipping: true } : {}),
          ...(input.isDefaultBilling ? { isBilling: true } : {}),
          ...(input.isShipping === false ? { isDefaultShipping: false } : {}),
          ...(input.isBilling === false ? { isDefaultBilling: false } : {}),
        },
      });
    });
    return this.getDto(userId);
  }

  async deleteAddress(userId: string, addressId: string) {
    await this.assertAddressOwner(userId, addressId);
    await this.prisma.address.delete({ where: { id: addressId } });
    return this.getDto(userId);
  }

  private async assertAddressOwner(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException("Address not found");
  }

  private async resetDefaults(
    tx: Prisma.TransactionClient,
    userId: string,
    input: Pick<UpdateAddressDto, "isDefaultShipping" | "isDefaultBilling">
  ) {
    if (input.isDefaultShipping) {
      await tx.address.updateMany({ where: { userId, isDefaultShipping: true }, data: { isDefaultShipping: false } });
    }
    if (input.isDefaultBilling) {
      await tx.address.updateMany({ where: { userId, isDefaultBilling: true }, data: { isDefaultBilling: false } });
    }
  }

  private ensureMinimumAge(dateOfBirth: string) {
    const birth = new Date(dateOfBirth);
    const threshold = new Date();
    threshold.setFullYear(threshold.getFullYear() - 13);
    if (Number.isNaN(birth.getTime()) || birth > threshold) {
      throw new ConflictException("User must be at least 13 years old");
    }
  }
}
