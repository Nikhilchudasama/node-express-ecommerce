import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { container } from '../config/container';

const authService = container.authService;

const requireUserId = (req: Request) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  return req.user.id;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body as { email: string; password: string; name?: string });
  sendSuccess(res, result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as { email: string; password: string });
  sendSuccess(res, result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.getProfile(requireUserId(req));
  sendSuccess(res, result);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.updateProfile(requireUserId(req), req.body as { name?: string });
  sendSuccess(res, result);
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.changePassword(requireUserId(req), req.body as { currentPassword: string; newPassword: string });
  sendSuccess(res, result);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refreshTokens(req.body as { refreshToken: string });
  sendSuccess(res, result);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  const result = await authService.logout();
  sendSuccess(res, result);
});
