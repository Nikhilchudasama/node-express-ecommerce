import { ProductService } from '../src/services/product.service';
import { ApiError } from '../src/utils/api-error';

const createRepositoryMock = () => ({
  findMany: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  findBySku: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProductService', () => {
  it('lists products with pagination metadata', async () => {
    const productRepository = createRepositoryMock();
    productRepository.findMany.mockResolvedValue([{ id: 1 }]);
    productRepository.count.mockResolvedValue(1);

    const service = new ProductService(productRepository);
    const result = await service.list({ page: '1', limit: '10' });

    expect(result.pagination.total).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it('throws when product is missing', async () => {
    const productRepository = createRepositoryMock();
    productRepository.findById.mockResolvedValue(null);

    const service = new ProductService(productRepository);

    await expect(service.getById(99)).rejects.toBeInstanceOf(ApiError);
  });
});
