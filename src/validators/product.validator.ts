import { z } from 'zod';

const priceSchema = z.coerce.number().positive('Price must be greater than 0');

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Product id must be a positive integer'),
});

export const productListQuerySchema = z.object({
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  minPrice: z.string().trim().optional(),
  maxPrice: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'price', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  price: priceSchema,
  compareAtPrice: z.coerce.number().positive().optional(),
  costPrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  weight: z.coerce.number().positive().optional(),
  imageUrl: z.string().trim().url().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  categoryId: z.coerce.number().int().positive('Category id is required'),
});

export const updateProductSchema = createProductSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field is required',
  }
);
