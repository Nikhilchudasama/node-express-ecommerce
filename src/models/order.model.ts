import type { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export type OrderStatusValue = OrderStatus;

export type OrderCreateInput = {
  userId: string;
  shippingAddressId?: string;
  billingAddressId?: string;
  notes?: string;
  couponCode?: string;
};

export type OrderUpdateStatusInput = {
  status: OrderStatusValue;
};

export type OrderItemResponse = {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  price: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  product: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
};

export type OrderResponse = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatusValue;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  subtotal: Prisma.Decimal;
  discountAmount: Prisma.Decimal | null;
  shippingCost: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  total: Prisma.Decimal;
  currency: string;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  notes: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemResponse[];
};
