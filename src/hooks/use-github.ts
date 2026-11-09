"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USE_API_MOCKS } from "@/lib/feature-flags";
import { getErrorMessage } from "@/lib/api-error";
import { githubMock } from "@/mocks/github.mock";
import { githubService } from "@/services/github.service";
import { repositoryService } from "@/services/repository.service";
import type { GithubConnectionState } from "@/types";

export const githubKeys = {
  all: ["github"] as const,
  connection: () => [...githubKeys.all, "connection"] as const,
};

/**
 * Connection status:
 * - Mock path: dedicated mock module (no CAP status endpoint).
 * - Live path: inferred from whether any GitHub repositories exist for the user.
 *   CAP has no GET /github/installation endpoint.
 */
async function fetchConnectionStatus(): Promise<GithubConnectionState> {
  if (USE_API_MOCKS) {
    return githubMock.getConnectionStatus();
  }

  const page = await repositoryService.list({ page: 1, limit: 1 });
  if (page.meta.total === 0) {
    return {
      connected: false,
      accountLogin: null,
      accountId: null,
      targetType: null,
      repositorySelection: null,
      installationId: null,
    };
  }

  const sample = page.items[0];
  return {
    connected: true,
    accountLogin: sample?.owner ?? null,
    accountId: null,
    targetType: null,
    repositorySelection: null,
    installationId: sample?.installationId ?? null,
  };
}

export function useGithubConnection() {
  return useQuery({
    queryKey: githubKeys.connection(),
    queryFn: fetchConnectionStatus,
  });
}

export function useConnectGithub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (USE_API_MOCKS) {
        return githubMock.startInstallation();
      }
      await githubService.startInstallation();
      return null;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(githubKeys.connection(), data);
      }
      void queryClient.invalidateQueries({ queryKey: githubKeys.connection() });
    },
  });
}

export function useDisconnectGithub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (USE_API_MOCKS) {
        return githubMock.disconnect();
      }
      /**
       * CAP has no app uninstall/disconnect endpoint.
       * Direct users to GitHub App installations settings.
       */
      throw new Error(
        "Disconnecting the GitHub App is not available via API. Manage the installation on GitHub."
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(githubKeys.connection(), data);
      void queryClient.invalidateQueries({ queryKey: githubKeys.all });
    },
  });
}

export function useGithubErrorMessage(error: unknown): string | null {
  if (!error) return null;
  return getErrorMessage(error);
}
