import type { Prisma } from '@prisma/client';

export type CartItemInput = {
  productId: number;
  quantity: number;
};

export type CartUpdateItemInput = {
  quantity: number;
};

export type CartItemResponse = {
  id: number;
  productId: number;
  quantity: number;
  price: Prisma.Decimal;
  product: {
    id: number;
    name: string;
    price: Prisma.Decimal;
    imageUrl: string | null;
  };
};

export type CartResponse = {
  id: string;
  userId: string | null;
  items: CartItemResponse[];
  createdAt: Date;
  updatedAt: Date;
};
