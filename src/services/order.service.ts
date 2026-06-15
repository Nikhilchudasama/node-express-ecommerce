import type { OrderStatus } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import type { OrderRepositoryLike } from '../repositories/order.repository';
import type { CartRepositoryLike } from '../repositories/cart.repository';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryLike,
    private readonly cartRepository: CartRepositoryLike
  ) {}

  async createOrder(userId: string) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    return { order: await this.orderRepository.createFromCart(userId) };
  }

  async getOrder(id: string, userId: string, isAdmin = false) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ApiError(403, 'Forbidden');
    }

    return { order };
  }

  async listUserOrders(userId: string) {
    return { orders: await this.orderRepository.findManyByUserId(userId) };
  }

  async listAdminOrders() {
    return { orders: await this.orderRepository.findManyForAdmin() };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return { order: await this.orderRepository.updateStatus(id, status) };
  }
}
