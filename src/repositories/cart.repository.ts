import { Prisma } from '@prisma/client';
import type { CartItemInput, CartUpdateItemInput } from '../models/cart.model';
import type { ExtendedPrismaClient } from '../config/prisma';

const cartItemSelect = {
  id: true,
  productId: true,
  quantity: true,
  price: true,
  product: {
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
    },
  },
};

export class CartRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findCartByUserId(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        items: {
          select: cartItemSelect,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
    });
  }

  addItem(cartId: string, input: CartItemInput & { price: Prisma.Decimal }) {
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId: input.productId,
        },
      },
      create: {
        cartId,
        productId: input.productId,
        quantity: input.quantity,
        price: input.price,
      },
      update: {
        quantity: {
          increment: input.quantity,
        },
      },
      select: cartItemSelect,
    });
  }

  updateItem(cartId: string, productId: number, input: CartUpdateItemInput) {
    return this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      data: {
        quantity: input.quantity,
      },
      select: cartItemSelect,
    });
  }

  removeItem(cartId: string, productId: number) {
    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

export type CartRepositoryLike = Pick<
  CartRepository,
  'findCartByUserId' | 'createCart' | 'addItem' | 'updateItem' | 'removeItem' | 'clearCart'
>;
