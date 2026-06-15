import type { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ApiError } from '../utils/api-error';
import { logger } from '../config/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      message: 'Database request failed',
    });
  }

  logger.error('Unhandled error', err instanceof Error ? err : undefined);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
