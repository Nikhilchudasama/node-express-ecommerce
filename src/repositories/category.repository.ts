import { Prisma } from '@prisma/client';
import type { CategoryInput, CategoryListQuery, CategoryUpdateInput } from '../models/category.model';
import type { ExtendedPrismaClient } from '../config/prisma';

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  parentId: true,
  parent: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  _count: {
    select: {
      products: true,
      children: true,
    },
  },
} satisfies Prisma.CategorySelect;

export class CategoryRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findMany(query: CategoryListQuery) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    return this.prisma.category.findMany({
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { name: query.sortOrder ?? 'asc' },
      skip,
      take: limit,
      select: categorySelect,
    });
  }

  count(query: CategoryListQuery) {
    return this.prisma.category.count({
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    });
  }

  findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      select: categorySelect,
    });
  }

  findByName(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
      select: categorySelect,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      select: categorySelect,
    });
  }

  create(data: CategoryInput) {
    const slug = data.slug ?? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId: data.parentId,
      },
      select: categorySelect,
    });
  }

  update(id: number, data: CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
      select: categorySelect,
    });
  }

  delete(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}

export type CategoryRepositoryLike = Pick<
  CategoryRepository,
  'findMany' | 'count' | 'findById' | 'findByName' | 'findBySlug' | 'create' | 'update' | 'delete'
>;
