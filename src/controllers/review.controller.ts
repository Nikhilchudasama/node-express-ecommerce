import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';

const reviewService = container.reviewService;

const requireUserId = (req: Request) => {
  if (!req.user) throw new ApiError(401, 'Authentication required');
  return req.user.id;
};

const requireProductId = (req: Request) => {
  const id = Number(req.params.productId);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid product id');
  return id;
};

const requireReviewId = (req: Request) => {
  const params = req.validated?.params as { id?: number } | undefined;
  const id = params?.id ?? Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid review id');
  return id;
};

export const listProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = requireProductId(req);
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const result = await reviewService.listByProduct(productId, page, limit);
  sendSuccess(res, result);
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const productId = requireProductId(req);
  const userId = requireUserId(req);
  const result = await reviewService.create(productId, userId, req.body as { rating: number; title?: string; comment?: string });
  sendSuccess(res, result, 201);
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const isAdmin = req.user!.role === 'ADMIN';
  const result = await reviewService.delete(requireReviewId(req), userId, isAdmin);
  sendSuccess(res, result);
});
