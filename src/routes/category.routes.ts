import { Router } from 'express';
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from '../controllers/category.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  categoryIdParamSchema,
  categoryListQuerySchema,
  createCategorySchema,
  updateCategorySchema,
  validateRequest,
} from '../validators';

export const categoryRouter = Router();

categoryRouter.get('/', validateRequest(categoryListQuerySchema, 'query'), listCategories);
categoryRouter.get('/:id', validateRequest(categoryIdParamSchema, 'params'), getCategory);
categoryRouter.post('/', authenticate, authorize('ADMIN'), validateRequest(createCategorySchema), createCategory);
categoryRouter.patch('/:id', authenticate, authorize('ADMIN'), validateRequest(categoryIdParamSchema, 'params'), validateRequest(updateCategorySchema), updateCategory);
categoryRouter.delete('/:id', authenticate, authorize('ADMIN'), validateRequest(categoryIdParamSchema, 'params'), deleteCategory);
