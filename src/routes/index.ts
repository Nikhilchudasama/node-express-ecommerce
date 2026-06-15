import { Router } from 'express';
import { authRouter } from './auth.routes';
import { cartRouter } from './cart.routes';
import { categoryRouter } from './category.routes';
import { couponRouter } from './coupon.routes';
import { healthRouter } from './health.routes';
import { orderRouter } from './order.routes';
import { productImageRouter } from './product-image.routes';
import { productRouter } from './product.routes';
import { reviewRouter } from './review.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/coupons', couponRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/', productImageRouter);
apiRouter.use('/', reviewRouter);
