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

/** Dedupes React Strict Mode / remount double-calls for the same token. */
const verifyEmailInFlight = new Map<string, Promise<void>>();

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

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post("/auth/forgot-password", { email });
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async resetPassword(values: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    try {
      await apiClient.post("/auth/reset-password", values);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async verifyEmail(token: string): Promise<void> {
    const existing = verifyEmailInFlight.get(token);
    if (existing) return existing;

    const request = (async () => {
      try {
        await apiClient.post("/auth/verify-email", { token });
      } catch (error) {
        throw toApiClientError(error);
      } finally {
        verifyEmailInFlight.delete(token);
      }
    })();

    verifyEmailInFlight.set(token, request);
    return request;
  },

  logout(): void {
    clearAuthTokens();
  },
};
