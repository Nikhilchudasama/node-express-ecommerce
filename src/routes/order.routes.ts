import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { createOrder, getOrder, listAdminOrders, listMyOrders, updateOrderStatus } from '../controllers/order.controller';
import { orderIdParamSchema, orderStatusSchema, validateRequest } from '../validators';

export const orderRouter = Router();

orderRouter.post('/', authenticate, createOrder);
orderRouter.get('/mine', authenticate, listMyOrders);
orderRouter.get('/admin', authenticate, authorize('ADMIN'), listAdminOrders);
orderRouter.get('/:id', authenticate, validateRequest(orderIdParamSchema, 'params'), getOrder);
orderRouter.patch('/:id/status', authenticate, authorize('ADMIN'), validateRequest(orderIdParamSchema, 'params'), validateRequest(orderStatusSchema), updateOrderStatus);
