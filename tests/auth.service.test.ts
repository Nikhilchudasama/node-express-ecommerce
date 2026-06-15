import { AuthService } from '../src/services/auth.service';
import { ApiError } from '../src/utils/api-error';

jest.mock('../src/auth/password', () => ({
  comparePassword: jest.fn(async () => true),
  hashPassword: jest.fn(async () => 'hashed-password'),
}));

jest.mock('../src/auth/jwt', () => ({
  signAccessToken: jest.fn(() => 'access-token'),
  signRefreshToken: jest.fn(() => 'refresh-token'),
  verifyRefreshToken: jest.fn(() => ({
    sub: 'user-1',
    email: 'user@example.com',
    role: 'CUSTOMER',
  })),
}));

const createRepositoryMock = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  createUserWithCart: jest.fn(),
  updateProfile: jest.fn(),
  updatePasswordHash: jest.fn(),
});

const mockUser = {
  id: 'user-1',
  email: 'user@example.com',
  name: 'User',
  phone: null,
  avatarUrl: null,
  role: 'CUSTOMER',
  status: 'ACTIVE',
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
};

const mockUserWithPassword = {
  ...mockUser,
  passwordHash: 'hashed-password',
};

describe('AuthService', () => {
  it('registers a new user', async () => {
    const userRepository = createRepositoryMock();
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.createUserWithCart.mockResolvedValue(mockUser);

    const service = new AuthService(userRepository);
    const result = await service.register({
      email: 'User@Example.com',
      password: 'password123',
      name: 'User',
    });

    expect(userRepository.createUserWithCart).toHaveBeenCalledWith({
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      name: 'User',
    });
    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('rejects duplicate registration', async () => {
    const userRepository = createRepositoryMock();
    userRepository.findByEmail.mockResolvedValue({ id: 'existing' });

    const service = new AuthService(userRepository);

    await expect(
      service.register({
        email: 'user@example.com',
        password: 'password123',
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('returns profile for existing user', async () => {
    const userRepository = createRepositoryMock();
    userRepository.findById.mockResolvedValue(mockUser);

    const service = new AuthService(userRepository);
    const result = await service.getProfile('user-1');

    expect(result.user.email).toBe('user@example.com');
  });

  it('logs in an existing user', async () => {
    const userRepository = createRepositoryMock();
    userRepository.findByEmail.mockResolvedValue(mockUserWithPassword);

    const service = new AuthService(userRepository);
    const result = await service.login({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result.tokens).toBeDefined();
    expect(result.tokens?.accessToken).toBe('access-token');
    expect(result.user.email).toBe('user@example.com');
  });

  it('refreshes tokens for a valid refresh token', async () => {
    const userRepository = createRepositoryMock();
    userRepository.findById.mockResolvedValue(mockUser);

    const service = new AuthService(userRepository);
    const result = await service.refreshTokens({
      refreshToken: 'refresh-token-value',
    });

    expect(result.tokens).toBeDefined();
    expect(result.tokens?.refreshToken).toBe('refresh-token');
    expect(result.user.id).toBe('user-1');
  });

  it('changes password for the current user', async () => {
    const userRepository = createRepositoryMock();
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.findByEmail.mockResolvedValue(mockUserWithPassword);
    userRepository.updatePasswordHash.mockResolvedValue({});

    const service = new AuthService(userRepository);
    const result = await service.changePassword('user-1', {
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    });

    expect(result.message).toBe('Password updated successfully');
    expect(userRepository.updatePasswordHash).toHaveBeenCalledWith('user-1', 'hashed-password');
  });
});
