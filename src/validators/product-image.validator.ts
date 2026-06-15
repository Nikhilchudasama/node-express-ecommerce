import { z } from 'zod';

export const createProductImageSchema = z.object({
  url: z.string().trim().url('Valid image URL is required'),
  altText: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isPrimary: z.coerce.boolean().optional(),
});

export const updateProductImageSchema = createProductImageSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one field is required' }
);

export const productImageIdParamSchema = z.object({
  imageId: z.coerce.number().int().positive('Image id must be a positive integer'),
});
