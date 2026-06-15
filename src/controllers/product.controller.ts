import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';
import type { ProductInput, ProductUpdateInput } from '../models/product.model';

const productService = container.productService;

const requireProductId = (req: Request) => {
  const params = req.validated?.params as { id?: number } | undefined;
  const id = params?.id ?? Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'Invalid product id');
  }

  return id;
};

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.list((req.validated?.query as Record<string, string>) ?? {});
  sendSuccess(res, result);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getById(requireProductId(req));
  sendSuccess(res, result);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.create(req.body as ProductInput);
  sendSuccess(res, result, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.update(requireProductId(req), req.body as ProductUpdateInput);
  sendSuccess(res, result);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.remove(requireProductId(req));
  sendSuccess(res, result);
});
