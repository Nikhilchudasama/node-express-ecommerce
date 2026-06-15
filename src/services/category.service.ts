import { ApiError } from '../utils/api-error';
import type { CategoryInput, CategoryListQuery, CategoryUpdateInput } from '../models/category.model';
import type { CategoryRepositoryLike } from '../repositories/category.repository';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepositoryLike) {}

  async list(query: CategoryListQuery) {
    const [items, total] = await Promise.all([
      this.categoryRepository.findMany(query),
      this.categoryRepository.count(query),
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
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    return { category };
  }

  async create(input: CategoryInput) {
    const existingName = await this.categoryRepository.findByName(input.name);
    if (existingName) {
      throw new ApiError(409, 'A category with this name already exists');
    }
    const slug = input.slug ?? input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ApiError(409, 'A category with this slug already exists');
    }
    return { category: await this.categoryRepository.create(input) };
  }

  async update(id: number, input: CategoryUpdateInput) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    if (input.name !== undefined && input.name !== category.name) {
      const existing = await this.categoryRepository.findByName(input.name);
      if (existing) {
        throw new ApiError(409, 'A category with this name already exists');
      }
    }
    if (input.slug !== undefined && input.slug !== category.slug) {
      const existing = await this.categoryRepository.findBySlug(input.slug);
      if (existing) {
        throw new ApiError(409, 'A category with this slug already exists');
      }
    }
    return { category: await this.categoryRepository.update(id, input) };
  }

  async remove(id: number) {
    await this.getById(id);
    await this.categoryRepository.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
