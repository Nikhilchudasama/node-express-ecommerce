import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive('Product id is required'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
});

export const cartItemParamSchema = z.object({
  productId: z.coerce.number().int().positive('Product id must be a positive integer'),
});
