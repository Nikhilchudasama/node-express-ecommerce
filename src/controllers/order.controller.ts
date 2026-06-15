import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';

const orderService = container.orderService;

const requireUser = (req: Request) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  return req.user;
};

const requireOrderId = (req: Request) => {
  const params = req.validated?.params as { id?: string } | undefined;
  const id = params?.id ?? req.params.id;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid order id');
  }

  return id;
};

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const result = await orderService.createOrder(user.id);
  sendSuccess(res, result, 201);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const result = await orderService.getOrder(requireOrderId(req), user.id, user.role === 'ADMIN');
  sendSuccess(res, result);
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const result = await orderService.listUserOrders(user.id);
  sendSuccess(res, result);
});

export const listAdminOrders = asyncHandler(async (_req: Request, res: Response) => {
  const result = await orderService.listAdminOrders();
  sendSuccess(res, result);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.updateStatus(requireOrderId(req), req.body.status);
  sendSuccess(res, result);
});
