import { ApiError } from '../utils/api-error';
import { comparePassword, hashPassword } from '../auth/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../auth/jwt';
import type { AuthResponse, AuthTokens, ChangePasswordRequestBody, LoginRequestBody, RefreshTokenRequestBody, RegisterRequestBody, UpdateProfileRequestBody } from '../models';
import type { AuthUser } from '../models/user.model';
import type { UserRepositoryLike } from '../repositories/user.repository';

const buildTokens = (user: Pick<AuthUser, 'id' | 'email' | 'role'>): AuthTokens => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  } as const;

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const normalizeEmail = (email: string) => email.toLowerCase().trim();

export class AuthService {
  constructor(private readonly userRepository: UserRepositoryLike) {}

  async register(input: RegisterRequestBody): Promise<AuthResponse> {
    const email = normalizeEmail(input.email);
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await this.userRepository.createUserWithCart({
      email,
      passwordHash,
      name: input.name?.trim() || 'User',
    });

    return {
      user,
      tokens: buildTokens(user),
    };
  }

  async login(input: LoginRequestBody): Promise<AuthResponse> {
    const email = normalizeEmail(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const { passwordHash, ...safeUser } = user;
    void passwordHash;

    return {
      user: safeUser,
      tokens: buildTokens(safeUser),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return { user };
  }

  async updateProfile(userId: string, input: UpdateProfileRequestBody) {
    return {
      user: await this.userRepository.updateProfile(userId, { name: input.name?.trim() || undefined }),
    };
  }

  async changePassword(userId: string, input: ChangePasswordRequestBody) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const passwordRecord = await this.userRepository.findByEmail(user.email);
    if (!passwordRecord) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await comparePassword(input.currentPassword, passwordRecord.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const passwordHash = await hashPassword(input.newPassword);
    await this.userRepository.updatePasswordHash(userId, passwordHash);

    return { message: 'Password updated successfully' };
  }

  async refreshTokens(input: RefreshTokenRequestBody): Promise<AuthResponse> {
    const payload = verifyRefreshToken(input.refreshToken);
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      user,
      tokens: buildTokens(user),
    };
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }
}
