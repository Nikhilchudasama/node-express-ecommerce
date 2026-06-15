import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error';
import { verifyToken } from '../auth/jwt';
import type { AuthenticatedUser } from '../auth/types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = header.slice(7);
  const payload = verifyToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };

  next();
};
