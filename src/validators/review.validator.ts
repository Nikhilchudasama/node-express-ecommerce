import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().trim().optional(),
  comment: z.string().trim().optional(),
});

export const reviewIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Review id must be a positive integer'),
});

export const productReviewsQuerySchema = z.object({
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
});
