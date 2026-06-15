import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const orderIdParamSchema = z.object({
  id: z.string().uuid('Invalid order id'),
});

export const orderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
