import { z } from 'zod';
import { DiscountType } from '@prisma/client';

export const couponIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Coupon id must be a positive integer'),
});

export const createCouponSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').transform((v) => v.toUpperCase()),
  description: z.string().trim().optional(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.coerce.number().positive('Discount value must be positive'),
  minOrderAmount: z.coerce.number().positive().optional(),
  maxUsageCount: z.coerce.number().int().positive().optional(),
  maxUsagePerUser: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const updateCouponSchema = createCouponSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one field is required' }
);

export const validateCouponQuerySchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  cartTotal: z.coerce.number().positive().optional(),
});
