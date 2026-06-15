import type { ExtendedPrismaClient } from '../config/prisma';

const imageSelect = {
  id: true,
  productId: true,
  url: true,
  altText: true,
  sortOrder: true,
  isPrimary: true,
};

export class ProductImageRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findByProduct(productId: number) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
      select: imageSelect,
    });
  }

  findById(id: number) {
    return this.prisma.productImage.findUnique({
      where: { id },
      select: imageSelect,
    });
  }

  create(productId: number, data: { url: string; altText?: string; sortOrder?: number; isPrimary?: boolean }) {
    return this.prisma.productImage.create({
      data: {
        productId,
        url: data.url,
        altText: data.altText,
        sortOrder: data.sortOrder ?? 0,
        isPrimary: data.isPrimary ?? false,
      },
      select: imageSelect,
    });
  }

  update(id: number, data: { url?: string; altText?: string | null; sortOrder?: number; isPrimary?: boolean }) {
    return this.prisma.productImage.update({
      where: { id },
      data,
      select: imageSelect,
    });
  }

  delete(id: number) {
    return this.prisma.productImage.delete({ where: { id } });
  }

  async clearPrimaryFlag(productId: number) {
    await this.prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    });
  }
}

export type ProductImageRepositoryLike = Pick<
  ProductImageRepository,
  'findByProduct' | 'findById' | 'create' | 'update' | 'delete' | 'clearPrimaryFlag'
>;
