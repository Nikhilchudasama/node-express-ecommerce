import { CartService } from '../src/services/cart.service';
import { ApiError } from '../src/utils/api-error';

const createCartRepositoryMock = () => ({
  findCartByUserId: jest.fn(),
  createCart: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
});

const createProductRepositoryMock = () => ({
  findById: jest.fn(),
});

describe('CartService', () => {
  it('adds an item to the cart', async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    productRepository.findById.mockResolvedValue({ id: 1, price: '29.99' });
    cartRepository.findCartByUserId.mockResolvedValue({ id: 'cart-1', items: [] });
    cartRepository.addItem.mockResolvedValue({ id: 1, productId: 1, quantity: 2, price: '29.99' });

    const service = new CartService(cartRepository, productRepository);
    const result = await service.addItem('user-1', { productId: 1, quantity: 2 });

    expect(result.item.quantity).toBe(2);
  });

  it('throws when product is missing', async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    productRepository.findById.mockResolvedValue(null);

    const service = new CartService(cartRepository, productRepository);

    await expect(service.addItem('user-1', { productId: 1, quantity: 1 })).rejects.toBeInstanceOf(ApiError);
  });

  it('creates cart if missing when adding item', async () => {
    const cartRepository = createCartRepositoryMock();
    const productRepository = createProductRepositoryMock();

    productRepository.findById.mockResolvedValue({ id: 1, price: '29.99' });
    cartRepository.findCartByUserId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'cart-1', items: [] });
    cartRepository.createCart.mockResolvedValue({ id: 'cart-1' });
    cartRepository.addItem.mockResolvedValue({ id: 1, productId: 1, quantity: 1, price: '29.99' });

    const service = new CartService(cartRepository, productRepository);
    const result = await service.addItem('user-1', { productId: 1, quantity: 1 });

    expect(cartRepository.createCart).toHaveBeenCalledWith('user-1');
    expect(result.item).toBeDefined();
  });
});
