import type { ExtendedPrismaClient } from '../config/prisma';
import type { CreateReviewInput } from '../models/review.model';

const reviewSelect = {
  id: true,
  productId: true,
  userId: true,
  rating: true,
  title: true,
  comment: true,
  isVerifiedPurchase: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

export class ReviewRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findManyByProduct(productId: number, skip = 0, take = 10) {
    return this.prisma.review.findMany({
      where: { productId, isActive: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: reviewSelect,
    });
  }

  countByProduct(productId: number) {
    return this.prisma.review.count({
      where: { productId, isActive: true },
    });
  }

  findById(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      select: reviewSelect,
    });
  }

  findByProductAndUser(productId: number, userId: string) {
    return this.prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
      select: reviewSelect,
    });
  }

  create(productId: number, userId: string, data: CreateReviewInput) {
    return this.prisma.review.create({
      data: {
        productId,
        userId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      },
      select: reviewSelect,
    });
  }

  delete(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }
}

export type ReviewRepositoryLike = Pick<
  ReviewRepository,
  'findManyByProduct' | 'countByProduct' | 'findById' | 'findByProductAndUser' | 'create' | 'delete'
>;
