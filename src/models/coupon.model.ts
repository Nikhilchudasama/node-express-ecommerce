import type { DiscountType } from '@prisma/client';

export type CreateCouponInput = {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  maxUsagePerUser?: number;
  expiresAt?: string;
};

export type UpdateCouponInput = Partial<CreateCouponInput>;

export type CouponResponse = {
  id: number;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: import('@prisma/client').Prisma.Decimal;
  minOrderAmount: import('@prisma/client').Prisma.Decimal | null;
  maxUsageCount: number | null;
  usedCount: number;
  maxUsagePerUser: number | null;
  isActive: boolean;
  startsAt: Date;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
