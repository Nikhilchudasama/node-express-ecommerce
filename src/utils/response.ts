import type { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    data,
  });

export const sendError = (res: Response, statusCode: number, message: string) =>
  res.status(statusCode).json({
    success: false,
    message,
  });
