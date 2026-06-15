import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { listCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/coupon.controller';
import { couponIdParamSchema, createCouponSchema, updateCouponSchema, validateCouponQuerySchema, validateRequest } from '../validators';

export const couponRouter = Router();

couponRouter.get('/validate', validateRequest(validateCouponQuerySchema, 'query'), validateCoupon);
couponRouter.get('/', authenticate, authorize('ADMIN'), listCoupons);
couponRouter.get('/:id', authenticate, authorize('ADMIN'), validateRequest(couponIdParamSchema, 'params'), getCoupon);
couponRouter.post('/', authenticate, authorize('ADMIN'), validateRequest(createCouponSchema), createCoupon);
couponRouter.patch('/:id', authenticate, authorize('ADMIN'), validateRequest(couponIdParamSchema, 'params'), validateRequest(updateCouponSchema), updateCoupon);
couponRouter.delete('/:id', authenticate, authorize('ADMIN'), validateRequest(couponIdParamSchema, 'params'), deleteCoupon);
