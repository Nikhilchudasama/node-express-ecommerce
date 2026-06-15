import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/api-error';

export type JwtUserPayload = {
  sub: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
};

export const signAccessToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: '15m',
  });
};

export const signRefreshToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtUserPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as JwtUserPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};
