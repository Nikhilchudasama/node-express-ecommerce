import { ApiError } from '../utils/api-error';
import type { ProductInput, ProductListQuery, ProductUpdateInput } from '../models/product.model';
import type { ProductRepositoryLike } from '../repositories/product.repository';

export class ProductService {
  constructor(private readonly productRepository: ProductRepositoryLike) {}

  async list(query: ProductListQuery) {
    const [items, total] = await Promise.all([
      this.productRepository.findMany(query),
      this.productRepository.count(query),
    ]);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

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

  async getById(id: number) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return { product };
  }

  async create(input: ProductInput) {
    const slug = input.slug ?? input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existingSlug = await this.productRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ApiError(409, 'A product with this slug already exists');
    }
    if (input.sku) {
      const existingSku = await this.productRepository.findBySku(input.sku);
      if (existingSku) {
        throw new ApiError(409, 'A product with this SKU already exists');
      }
    }
    return { product: await this.productRepository.create(input) };
  }

  async update(id: number, input: ProductUpdateInput) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    if (input.slug !== undefined && input.slug !== product.slug) {
      const existing = await this.productRepository.findBySlug(input.slug);
      if (existing) {
        throw new ApiError(409, 'A product with this slug already exists');
      }
    }
    if (input.sku !== undefined && input.sku !== product.sku) {
      const existing = await this.productRepository.findBySku(input.sku);
      if (existing) {
        throw new ApiError(409, 'A product with this SKU already exists');
      }
    }
    return { product: await this.productRepository.update(id, input) };
  }

  async remove(id: number) {
    await this.getById(id);
    await this.productRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
