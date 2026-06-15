import { Prisma } from '@prisma/client';
import type { OrderStatus } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import type { ExtendedPrismaClient } from '../config/prisma';

const orderSelect = {
  id: true,
  orderNumber: true,
  userId: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  discountAmount: true,
  shippingCost: true,
  taxAmount: true,
  total: true,
  currency: true,
  shippingAddressId: true,
  billingAddressId: true,
  notes: true,
  trackingNumber: true,
  carrier: true,
  estimatedDelivery: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      productId: true,
      name: true,
      quantity: true,
      price: true,
      subtotal: true,
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  },
} satisfies Prisma.OrderSelect;

function generateOrderNumber(): string {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `ORD-${yy}${mm}${dd}-${seq}`;
}

export class OrderRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  createFromCart(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        select: {
          id: true,
          items: {
            select: {
              productId: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, 'Cart is empty');
      }

      const subtotal = cart.items.reduce(
        (sum, item) => sum.plus(item.price.mul(item.quantity)),
        new Prisma.Decimal(0)
      );

      const order = await tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          subtotal,
          total: subtotal,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              sku: item.product.sku,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.price.mul(item.quantity),
            })),
          },
        },
        select: orderSelect,
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      select: orderSelect,
    });
  }

  findManyByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: orderSelect,
    });
  }

  findManyForAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: orderSelect,
    });
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      select: orderSelect,
    });
  }
}

export type OrderRepositoryLike = Pick<
  OrderRepository,
  'createFromCart' | 'findById' | 'findManyByUserId' | 'findManyForAdmin' | 'updateStatus'
>;
