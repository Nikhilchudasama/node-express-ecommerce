import { ApiError } from '../utils/api-error';
import type { ProductImageRepositoryLike } from '../repositories/product-image.repository';
import type { ProductRepositoryLike } from '../repositories/product.repository';

export class ProductImageService {
  constructor(
    private readonly imageRepository: ProductImageRepositoryLike,
    private readonly productRepository: Pick<ProductRepositoryLike, 'findById'>,
  ) {}

  async listByProduct(productId: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return { images: await this.imageRepository.findByProduct(productId) };
  }

  async create(productId: number, data: { url: string; altText?: string; sortOrder?: number; isPrimary?: boolean }) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (data.isPrimary) {
      await this.imageRepository.clearPrimaryFlag(productId);
    }

    return { image: await this.imageRepository.create(productId, data) };
  }

  async update(imageId: number, data: { url?: string; altText?: string | null; sortOrder?: number; isPrimary?: boolean }) {
    const existing = await this.imageRepository.findById(imageId);
    if (!existing) {
      throw new ApiError(404, 'Image not found');
    }

    if (data.isPrimary) {
      await this.imageRepository.clearPrimaryFlag(existing.productId);
    }

    return { image: await this.imageRepository.update(imageId, data) };
  }

  async remove(imageId: number) {
    const existing = await this.imageRepository.findById(imageId);
    if (!existing) {
      throw new ApiError(404, 'Image not found');
    }

    await this.imageRepository.delete(imageId);
    return { message: 'Image deleted successfully' };
  }
}

export type ProductImageServiceLike = Pick<
  ProductImageService,
  'listByProduct' | 'create' | 'update' | 'remove'
>;
