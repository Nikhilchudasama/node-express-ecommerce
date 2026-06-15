import { Prisma } from '@prisma/client';
import type { ExtendedPrismaClient } from '../config/prisma';
import type { CreateCouponInput, UpdateCouponInput } from '../models/coupon.model';

const couponSelect = {
  id: true,
  code: true,
  description: true,
  discountType: true,
  discountValue: true,
  minOrderAmount: true,
  maxUsageCount: true,
  usedCount: true,
  maxUsagePerUser: true,
  isActive: true,
  startsAt: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
};

export class CouponRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findMany(skip = 0, take = 10) {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: couponSelect,
    });
  }

  count() {
    return this.prisma.coupon.count();
  }

  findById(id: number) {
    return this.prisma.coupon.findUnique({
      where: { id },
      select: couponSelect,
    });
  }

  findByCode(code: string) {
    return this.prisma.coupon.findUnique({
      where: { code },
      select: couponSelect,
    });
  }

  create(data: CreateCouponInput) {
    return this.prisma.coupon.create({
      data: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: new Prisma.Decimal(data.discountValue),
        minOrderAmount: data.minOrderAmount != null ? new Prisma.Decimal(data.minOrderAmount) : undefined,
        maxUsageCount: data.maxUsageCount,
        maxUsagePerUser: data.maxUsagePerUser,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
      select: couponSelect,
    });
  }

  update(id: number, data: UpdateCouponInput) {
    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.discountType !== undefined ? { discountType: data.discountType } : {}),
        ...(data.discountValue !== undefined ? { discountValue: new Prisma.Decimal(data.discountValue) } : {}),
        ...(data.minOrderAmount !== undefined ? { minOrderAmount: data.minOrderAmount != null ? new Prisma.Decimal(data.minOrderAmount) : null } : {}),
        ...(data.maxUsageCount !== undefined ? { maxUsageCount: data.maxUsageCount } : {}),
        ...(data.maxUsagePerUser !== undefined ? { maxUsagePerUser: data.maxUsagePerUser } : {}),
        ...(data.expiresAt !== undefined ? { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null } : {}),
      },
      select: couponSelect,
    });
  }

  delete(id: number) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}

export type CouponRepositoryLike = Pick<
  CouponRepository,
  'findMany' | 'count' | 'findById' | 'findByCode' | 'create' | 'update' | 'delete'
>;
