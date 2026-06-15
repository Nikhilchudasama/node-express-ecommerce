import type { UserRole, UserStatus } from '@prisma/client';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthUserWithPassword = AuthUser & {
  passwordHash: string;
};
