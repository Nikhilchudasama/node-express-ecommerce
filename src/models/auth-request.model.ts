export type RegisterRequestBody = {
  email: string;
  password: string;
  name?: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type UpdateProfileRequestBody = {
  name?: string;
};

export type ChangePasswordRequestBody = {
  currentPassword: string;
  newPassword: string;
};

export type RefreshTokenRequestBody = {
  refreshToken: string;
};
