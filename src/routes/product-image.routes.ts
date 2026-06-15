import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { listProductImages, createProductImage, updateProductImage, deleteProductImage } from '../controllers/product-image.controller';
import { createProductImageSchema, updateProductImageSchema, productImageIdParamSchema, validateRequest } from '../validators';

export const productImageRouter = Router();

productImageRouter.get('/products/:productId/images', listProductImages);
productImageRouter.post('/products/:productId/images', authenticate, authorize('ADMIN'), validateRequest(createProductImageSchema), createProductImage);
productImageRouter.patch('/products/:productId/images/:imageId', authenticate, authorize('ADMIN'), validateRequest(productImageIdParamSchema, 'params'), validateRequest(updateProductImageSchema), updateProductImage);
productImageRouter.delete('/products/:productId/images/:imageId', authenticate, authorize('ADMIN'), validateRequest(productImageIdParamSchema, 'params'), deleteProductImage);
