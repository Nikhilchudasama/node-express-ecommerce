import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';
import type { CategoryInput, CategoryUpdateInput } from '../models/category.model';

const categoryService = container.categoryService;

const requireCategoryId = (req: Request) => {
  const params = req.validated?.params as { id?: number } | undefined;
  const id = params?.id ?? Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'Invalid category id');
  }

  return id;
};

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.list((req.validated?.query as Record<string, string>) ?? {});
  sendSuccess(res, result);
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.getById(requireCategoryId(req));
  sendSuccess(res, result);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.create(req.body as CategoryInput);
  sendSuccess(res, result, 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.update(requireCategoryId(req), req.body as CategoryUpdateInput);
  sendSuccess(res, result);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.remove(requireCategoryId(req));
  sendSuccess(res, result);
});
