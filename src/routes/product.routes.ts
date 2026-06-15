import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../controllers/product.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  createProductSchema,
  productIdParamSchema,
  productListQuerySchema,
  updateProductSchema,
  validateRequest,
} from '../validators';

export const productRouter = Router();

productRouter.get('/', validateRequest(productListQuerySchema, 'query'), listProducts);
productRouter.get('/:id', validateRequest(productIdParamSchema, 'params'), getProduct);
productRouter.post('/', authenticate, authorize('ADMIN'), validateRequest(createProductSchema), createProduct);
productRouter.patch('/:id', authenticate, authorize('ADMIN'), validateRequest(productIdParamSchema, 'params'), validateRequest(updateProductSchema), updateProduct);
productRouter.delete('/:id', authenticate, authorize('ADMIN'), validateRequest(productIdParamSchema, 'params'), deleteProduct);
