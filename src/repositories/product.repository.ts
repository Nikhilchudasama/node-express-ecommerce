import { Prisma } from '@prisma/client';
import type { ProductInput, ProductListQuery, ProductUpdateInput } from '../models/product.model';
import type { ExtendedPrismaClient } from '../config/prisma';

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  summary: true,
  sku: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  isActive: true,
  isFeatured: true,
  imageUrl: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      altText: true,
      isPrimary: true,
    },
    orderBy: { sortOrder: 'asc' },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

export class ProductRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findMany(query: ProductListQuery) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.categoryId ? { categoryId: Number(query.categoryId) } : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            price: {
              ...(query.minPrice ? { gte: new Prisma.Decimal(query.minPrice) } : {}),
              ...(query.maxPrice ? { lte: new Prisma.Decimal(query.maxPrice) } : {}),
            },
          }
        : {}),
    };

    return this.prisma.product.findMany({
      where,
      orderBy: {
        [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
      },
      skip,
      take: limit,
      select: productSelect,
    });
  }

  count(query: ProductListQuery) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.categoryId ? { categoryId: Number(query.categoryId) } : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            price: {
              ...(query.minPrice ? { gte: new Prisma.Decimal(query.minPrice) } : {}),
              ...(query.maxPrice ? { lte: new Prisma.Decimal(query.maxPrice) } : {}),
            },
          }
        : {}),
    };

    return this.prisma.product.count({ where });
  }

  findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      select: productSelect,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      select: productSelect,
    });
  }

  findBySku(sku: string) {
    return this.prisma.product.findUnique({
      where: { sku },
      select: productSelect,
    });
  }

  create(data: ProductInput) {
    const slug = data.slug ?? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        summary: data.summary,
        sku: data.sku,
        barcode: data.barcode,
        price: new Prisma.Decimal(data.price),
        compareAtPrice: data.compareAtPrice != null ? new Prisma.Decimal(data.compareAtPrice) : undefined,
        costPrice: data.costPrice != null ? new Prisma.Decimal(data.costPrice) : undefined,
        stock: data.stock ?? 0,
        weight: data.weight != null ? new Prisma.Decimal(data.weight) : undefined,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder ?? 0,
        categoryId: data.categoryId,
      },
      select: productSelect,
    });
  }

  update(id: number, data: ProductUpdateInput) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice != null ? new Prisma.Decimal(data.compareAtPrice) : null;
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice != null ? new Prisma.Decimal(data.costPrice) : null;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.weight !== undefined) updateData.weight = data.weight != null ? new Prisma.Decimal(data.weight) : null;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      select: productSelect,
    });
  }

  async delete(id: number) {
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export type ProductRepositoryLike = Pick<
  ProductRepository,
  'findMany' | 'count' | 'findById' | 'findBySlug' | 'findBySku' | 'create' | 'update' | 'delete'
>;
