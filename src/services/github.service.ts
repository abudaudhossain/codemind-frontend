import { apiClient, getAccessToken, unwrapApiData } from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";
import type { ApiResponse, GithubInstallResult } from "@/types";

/**
 * Verified CAP GitHub endpoints:
 * - GET /github/install (JWT, HTTP redirect to GitHub App install)
 * - GET /github/setup (public callback — handled by backend, not frontend)
 *
 * Missing (no CAP controller):
 * - GET connection/installation status
 * - POST disconnect GitHub App / revoke installation
 */
export const githubService = {
  /**
   * Returns the absolute URL for GitHub App installation.
   * Browser navigation must include the Bearer token; CAP only reads
   * `Authorization: Bearer` (no query/cookie extractor), so callers should
   * prefer `startInstallation()` which opens a fetch-based redirect flow
   * when possible, or navigate with a documented auth limitation.
   */
  getInstallUrl(): string {
    const base = apiClient.defaults.baseURL ?? "http://localhost:4000";
    return `${base.replace(/\/$/, "")}/github/install`;
  },

  /**
   * Initiate GitHub App install. CAP responds with a 302 to GitHub.
   * Axios follows redirects for XHR and may lose the Location target for
   * cross-origin GitHub URLs, so we request without following and read
   * Location when available; otherwise fall back to window navigation.
   */
  async startInstallation(): Promise<void> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw toApiClientError(
          new Error("Sign in is required before connecting GitHub.")
        );
      }

      const response = await apiClient.get<ApiResponse<GithubInstallResult> | string>(
        "/github/install",
        {
          maxRedirects: 0,
          validateStatus: (status) =>
            (status >= 200 && status < 400) || status === 302,
        }
      );

      const location =
        typeof response.headers.location === "string"
          ? response.headers.location
          : null;

      if (location) {
        window.location.assign(location);
        return;
      }

      // If the server returned JSON instead of redirect (unexpected).
      if (response.data && typeof response.data === "object") {
        unwrapApiData(response.data);
      }

      window.location.assign(this.getInstallUrl());
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
