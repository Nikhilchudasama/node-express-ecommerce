import { CategoryService } from '../src/services/category.service';
import { ApiError } from '../src/utils/api-error';

const createRepositoryMock = () => ({
  findMany: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CategoryService', () => {
  it('returns category details', async () => {
    const categoryRepository = createRepositoryMock();
    categoryRepository.findById.mockResolvedValue({ id: 1, name: 'General' });

    const service = new CategoryService(categoryRepository);
    const result = await service.getById(1);

    expect(result.category.name).toBe('General');
  });

  it('throws when category is missing', async () => {
    const categoryRepository = createRepositoryMock();
    categoryRepository.findById.mockResolvedValue(null);

    const service = new CategoryService(categoryRepository);

    await expect(service.getById(1)).rejects.toBeInstanceOf(ApiError);
  });
});
