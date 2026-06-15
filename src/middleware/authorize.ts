import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error';
import type { AuthenticatedUser } from '../auth/types';

export const authorize = (...allowedRoles: AuthenticatedUser['role'][]) => {
  return (req: Request, _res: Response, next: NextFunction) => {

    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  };
};
