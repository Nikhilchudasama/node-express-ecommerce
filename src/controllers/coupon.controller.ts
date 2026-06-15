import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';
import type { CreateCouponInput, UpdateCouponInput } from '../models/coupon.model';

const couponService = container.couponService;

const requireCouponId = (req: Request) => {
  const params = req.validated?.params as { id?: number } | undefined;
  const id = params?.id ?? Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid coupon id');
  return id;
};

export const listCoupons = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const result = await couponService.list(page, limit);
  sendSuccess(res, result);
});

export const getCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await couponService.getById(requireCouponId(req));
  sendSuccess(res, result);
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validated?.query as { code: string; cartTotal?: number } | undefined;
  const result = await couponService.validate(query!.code, query!.cartTotal);
  sendSuccess(res, result);
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await couponService.create(req.body as CreateCouponInput);
  sendSuccess(res, result, 201);
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await couponService.update(requireCouponId(req), req.body as UpdateCouponInput);
  sendSuccess(res, result);
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await couponService.remove(requireCouponId(req));
  sendSuccess(res, result);
});
