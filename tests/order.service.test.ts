import { OrderStatus } from '@prisma/client';
import { OrderService } from '../src/services/order.service';
import { ApiError } from '../src/utils/api-error';

const createOrderRepositoryMock = () => ({
  createFromCart: jest.fn(),
  findById: jest.fn(),
  findManyByUserId: jest.fn(),
  findManyForAdmin: jest.fn(),
  updateStatus: jest.fn(),
});

const createCartRepositoryMock = () => ({
  findCartByUserId: jest.fn(),
  createCart: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
});

describe('OrderService', () => {
  it('creates an order when cart has items', async () => {
    const orderRepository = createOrderRepositoryMock();
    const cartRepository = createCartRepositoryMock();
    cartRepository.findCartByUserId.mockResolvedValue({ items: [{ id: 1 }] });
    orderRepository.createFromCart.mockResolvedValue({ id: 'order-1' });

    const service = new OrderService(orderRepository, cartRepository);
    const result = await service.createOrder('user-1');

    expect(result.order.id).toBe('order-1');
  });

  it('rejects empty carts', async () => {
    const orderRepository = createOrderRepositoryMock();
    const cartRepository = createCartRepositoryMock();
    cartRepository.findCartByUserId.mockResolvedValue({ items: [] });

    const service = new OrderService(orderRepository, cartRepository);

    await expect(service.createOrder('user-1')).rejects.toBeInstanceOf(ApiError);
  });

  it('updates order status', async () => {
    const orderRepository = createOrderRepositoryMock();
    const cartRepository = createCartRepositoryMock();
    orderRepository.findById.mockResolvedValue({ id: 'order-1', userId: 'user-1' });
    orderRepository.updateStatus.mockResolvedValue({ id: 'order-1', status: OrderStatus.SHIPPED });

    const service = new OrderService(orderRepository, cartRepository);
    const result = await service.updateStatus('order-1', OrderStatus.SHIPPED);

    expect(result.order.status).toBe(OrderStatus.SHIPPED);
  });
});
