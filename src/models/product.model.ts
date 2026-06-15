import type { Prisma } from '@prisma/client';

export type ProductListQuery = {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
};

export type ProductInput = {
  name: string;
  slug?: string;
  description?: string;
  summary?: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock?: number;
  weight?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  categoryId: number;
};

export type ProductUpdateInput = Partial<ProductInput>;

export type ProductResponse = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  summary: string | null;
  sku: string | null;
  price: Prisma.Decimal;
  compareAtPrice: Prisma.Decimal | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  images: {
    id: number;
    url: string;
    altText: string | null;
    isPrimary: boolean;
  }[];
};
