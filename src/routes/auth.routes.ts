import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { changePassword, login, logout, me, refreshToken, register, updateMe } from '../controllers/auth.controller';
import { changePasswordSchema, loginSchema, refreshTokenSchema, registerSchema, updateProfileSchema, validateRequest } from '../validators';

export const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), register);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.get('/me', authenticate, me);
authRouter.patch('/me', authenticate, validateRequest(updateProfileSchema), updateMe);
authRouter.patch('/password', authenticate, validateRequest(changePasswordSchema), changePassword);
authRouter.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);
authRouter.post('/logout', authenticate, logout);
