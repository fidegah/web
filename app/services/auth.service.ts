import { api } from "~/lib/api/client";
import { apiRoutes } from "~/lib/api/routes";
import type { AuthTokens } from "~/types";

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type ForgotPasswordInput = {
  email: string;
};

type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

type SendOtpInput = {
  email: string;
};

type VerifyOtpInput = {
  email: string;
  code: string;
};

export async function register(request: Request, body: RegisterInput) {
  await api.post(apiRoutes.auth.register, body);
}

export async function login(body: LoginInput): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>(apiRoutes.auth.login, body);

  return data;
}

export async function verifyEmail(token: string) {
  await api.get(apiRoutes.auth.verifyEmail, { params: { token } });
}

export async function exchangeCode(code: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>(apiRoutes.auth.exchangeCode, {
    code,
  });

  return data;
}

export async function forgotPassword(body: ForgotPasswordInput) {
  const { message } = await api.post(apiRoutes.auth.forgotPassword, body);

  return message;
}

export async function resetPassword(body: ResetPasswordInput) {
  await api.post(apiRoutes.auth.resetPassword, body);
}

export async function sendOtp(body: SendOtpInput): Promise<void> {
  await api.post(apiRoutes.auth.sendOtp, body);
}

export async function verifyOtp(body: VerifyOtpInput): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>(apiRoutes.auth.verifyOtp, body);

  return data;
}

export async function logout(refreshToken: string) {
  await api.post(apiRoutes.auth.logout, { refreshToken });
}
