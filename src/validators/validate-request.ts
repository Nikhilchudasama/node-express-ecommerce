import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ApiError } from '../utils/api-error';

type RequestPart = 'body' | 'params' | 'query';

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export const validateRequest = (schema: ZodTypeAny, part: RequestPart = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const message =
        result.error.issues
          .slice(0, 3)
          .map((issue) => issue.message)
          .join(', ') || 'Invalid request';

      throw new ApiError(400, message);
    }

    req.validated = req.validated ?? {};
    req.validated[part] = result.data;

    if (part === 'body') {
      req.body = result.data;
    }

    next();
  };
};
