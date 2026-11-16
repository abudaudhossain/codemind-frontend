import {
  apiClient,
  getAccessToken,
} from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";

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
   * Forward the bearer token through a same-origin route before navigating.
   * Browser navigations cannot set an Authorization header themselves.
   */
  async startInstallation(): Promise<void> {
    const token = getAccessToken();
    if (!token) {
      throw toApiClientError(
        new Error("Sign in is required before connecting GitHub.")
      );
    }

    try {
      const response = await fetch("/api/github/install", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await response.json()) as {
        location?: string;
        message?: string;
      };

      if (!response.ok || !body.location) {
        throw new Error(body.message ?? "Unable to start GitHub installation.");
      }

      window.location.assign(body.location);
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
