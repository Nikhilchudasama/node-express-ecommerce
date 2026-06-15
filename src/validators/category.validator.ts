import { z } from 'zod';

export const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Category id must be a positive integer'),
});

export const categoryListQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().url().optional(),
  parentId: z.coerce.number().int().positive().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field is required',
  }
);
