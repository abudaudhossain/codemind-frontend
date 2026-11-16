import {
  apiClient,
  clearAuthTokens,
  setAccessToken,
  setRefreshToken,
  unwrapApiData,
} from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";
import type { ApiResponse, AuthTokens, LoginFormValues, RegisterFormValues } from "@/types";

interface AuthResult {
  tokens?: AuthTokens;
  user?: {
    id: string | number;
    name?: string;
    email: string;
  };
}

export const authService = {
  async login(values: LoginFormValues): Promise<AuthResult> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResult>>(
        "/auth/login",
        values
      );
      const result = unwrapApiData(response.data);
      if (result.tokens) {
        setAccessToken(result.tokens.accessToken);
        setRefreshToken(result.tokens.refreshToken);
      }
      return result;
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async register(values: RegisterFormValues): Promise<void> {
    try {
      await apiClient.post("/auth/register", values);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async resendVerification(email: string): Promise<void> {
    try {
      await apiClient.post("/auth/resend-verification", { email });
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post("/auth/verify-email", { token });
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  logout(): void {
    clearAuthTokens();
  },
};
