import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';

const productImageService = container.productImageService;

const requireProductId = (req: Request) => {
  const id = Number(req.params.productId);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid product id');
  return id;
};

const requireImageId = (req: Request) => {
  const params = req.validated?.params as { imageId?: number } | undefined;
  const id = params?.imageId ?? Number(req.params.imageId);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid image id');
  return id;
};

export const listProductImages = asyncHandler(async (req: Request, res: Response) => {
  const result = await productImageService.listByProduct(requireProductId(req));
  sendSuccess(res, result);
});

export const createProductImage = asyncHandler(async (req: Request, res: Response) => {
  const result = await productImageService.create(requireProductId(req), req.body as { url: string; altText?: string; sortOrder?: number; isPrimary?: boolean });
  sendSuccess(res, result, 201);
});

export const updateProductImage = asyncHandler(async (req: Request, res: Response) => {
  const result = await productImageService.update(requireImageId(req), req.body as { url?: string; altText?: string; sortOrder?: number; isPrimary?: boolean });
  sendSuccess(res, result);
});

export const deleteProductImage = asyncHandler(async (req: Request, res: Response) => {
  const result = await productImageService.remove(requireImageId(req));
  sendSuccess(res, result);
});
