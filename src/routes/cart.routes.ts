import { Router } from 'express';
import { addItem, clearCart, getCart, removeItem, updateItem } from '../controllers/cart.controller';
import { authenticate } from '../middleware/authenticate';
import { cartItemParamSchema, cartItemSchema, validateRequest } from '../validators';

export const cartRouter = Router();

cartRouter.get('/', authenticate, getCart);
cartRouter.post('/items', authenticate, validateRequest(cartItemSchema), addItem);
cartRouter.patch('/items/:productId', authenticate, validateRequest(cartItemParamSchema, 'params'), validateRequest(cartItemSchema.omit({ productId: true })), updateItem);
cartRouter.delete('/items/:productId', authenticate, validateRequest(cartItemParamSchema, 'params'), removeItem);
cartRouter.delete('/', authenticate, clearCart);
