import type { AuthUser } from './user.model';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens?: AuthTokens;
};
