/**
 * Isolated mock for GitHub connection UI.
 * CAP has no GET /github/installation or connection-status endpoint.
 * Do not import this from `services/github.service.ts`.
 */

import type { GithubConnectionState } from "@/types";

let mockConnection: GithubConnectionState = {
  connected: true,
  accountLogin: "acme",
  accountId: "123456",
  targetType: "Organization",
  repositorySelection: "selected",
  installationId: "1094070",
};

export const githubMock = {
  async getConnectionStatus(): Promise<GithubConnectionState> {
    await delay(280);
    return { ...mockConnection };
  },

  async startInstallation(): Promise<GithubConnectionState> {
    await delay(400);
    mockConnection = {
      connected: true,
      accountLogin: "acme",
      accountId: "123456",
      targetType: "Organization",
      repositorySelection: "selected",
      installationId: "1094070",
    };
    return { ...mockConnection };
  },

  async disconnect(): Promise<GithubConnectionState> {
    await delay(300);
    mockConnection = {
      connected: false,
      accountLogin: null,
      accountId: null,
      targetType: null,
      repositorySelection: null,
      installationId: null,
    };
    return { ...mockConnection };
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
