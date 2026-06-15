import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { listProductReviews, createReview, deleteReview } from '../controllers/review.controller';
import { createReviewSchema, reviewIdParamSchema, validateRequest } from '../validators';

export const reviewRouter = Router();

reviewRouter.get('/products/:productId/reviews', listProductReviews);
reviewRouter.post('/products/:productId/reviews', authenticate, validateRequest(createReviewSchema), createReview);
reviewRouter.delete('/reviews/:id', authenticate, validateRequest(reviewIdParamSchema, 'params'), deleteReview);
