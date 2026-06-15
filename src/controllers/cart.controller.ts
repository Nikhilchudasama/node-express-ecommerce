import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';

const cartService = container.cartService;

const requireUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  return req.user.id;
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const result = await cartService.getCart(requireUserId(req));
  sendSuccess(res, result);
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const result = await cartService.addItem(requireUserId(req), req.body as { productId: number; quantity: number });
  sendSuccess(res, result, 201);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const params = req.validated?.params as { productId?: number } | undefined;
  const productId = params?.productId ?? Number(req.params.productId);
  const result = await cartService.updateItem(requireUserId(req), productId, req.body as { quantity: number });
  sendSuccess(res, result);
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const params = req.validated?.params as { productId?: number } | undefined;
  const productId = params?.productId ?? Number(req.params.productId);
  const result = await cartService.removeItem(requireUserId(req), productId);
  sendSuccess(res, result);
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const result = await cartService.clear(requireUserId(req));
  sendSuccess(res, result);
});
