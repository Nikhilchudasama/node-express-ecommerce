import { ApiError } from '../utils/api-error';
import type { CreateReviewInput } from '../models/review.model';
import type { ReviewRepositoryLike } from '../repositories/review.repository';
import type { ProductRepositoryLike } from '../repositories/product.repository';

export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepositoryLike,
    private readonly productRepository: Pick<ProductRepositoryLike, 'findById'>,
  ) {}

  async listByProduct(productId: number, page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      this.reviewRepository.findManyByProduct(productId, (page - 1) * limit, limit),
      this.reviewRepository.countByProduct(productId),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async create(productId: number, userId: string, input: CreateReviewInput) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const existing = await this.reviewRepository.findByProductAndUser(productId, userId);
    if (existing) {
      throw new ApiError(409, 'You have already reviewed this product');
    }

    return { review: await this.reviewRepository.create(productId, userId, input) };
  }

  async delete(id: number, userId: string, isAdmin: boolean) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ApiError(403, 'Forbidden');
    }

    await this.reviewRepository.delete(id);
    return { message: 'Review deleted successfully' };
  }
}

export type ReviewServiceLike = Pick<
  ReviewService,
  'listByProduct' | 'create' | 'delete'
>;
