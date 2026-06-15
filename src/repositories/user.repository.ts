import type { Prisma, UserRole } from '@prisma/client';
import type { ExtendedPrismaClient } from '../config/prisma';

const authUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatarUrl: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const authUserWithPasswordSelect = {
  ...authUserSelect,
  passwordHash: true,
} satisfies Prisma.UserSelect;

export class UserRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: authUserWithPasswordSelect,
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: authUserSelect,
    });
  }

  createUser(data: { email: string; passwordHash: string; name: string; role?: UserRole }) {
    return this.prisma.user.create({
      data,
      select: authUserSelect,
    });
  }

  updateProfile(id: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: authUserSelect,
    });
  }

  updatePasswordHash(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  createUserWithCart(data: { email: string; passwordHash: string; name: string; role?: UserRole }) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data, select: authUserSelect });
      await tx.cart.create({ data: { userId: user.id } });
      return user;
    });
  }
}

export type UserRepositoryLike = Pick<
  UserRepository,
  'findByEmail' | 'findById' | 'createUserWithCart' | 'updateProfile' | 'updatePasswordHash'
>;
