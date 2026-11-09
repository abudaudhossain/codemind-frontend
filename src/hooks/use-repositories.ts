"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { USE_API_MOCKS } from "@/lib/feature-flags";
import {
  computeRepositoryStats,
  filterAndSortRepositories,
  toRepositoryViewModel,
} from "@/lib/repository-status";
import { repositoryMock } from "@/mocks/repository.mock";
import { repositoryService } from "@/services/repository.service";
import type {
  IndexingStatus,
  RepositoryListFilters,
  RepositoryViewModel,
} from "@/types";

export const repositoryKeys = {
  all: ["repositories"] as const,
  lists: () => [...repositoryKeys.all, "list"] as const,
  list: (connected?: boolean) =>
    [...repositoryKeys.lists(), { connected }] as const,
  accessible: () => [...repositoryKeys.all, "accessible"] as const,
  details: () => [...repositoryKeys.all, "detail"] as const,
  detail: (id: string) => [...repositoryKeys.details(), id] as const,
};

async function fetchConnectedRepositories(): Promise<RepositoryViewModel[]> {
  if (USE_API_MOCKS) {
    return repositoryMock.listViewModels(true);
  }

  const page = await repositoryService.list({
    page: 1,
    limit: 100,
    connected: true,
  });

  return page.items.map((repo) => toRepositoryViewModel(repo));
}

async function fetchAccessibleRepositories(): Promise<RepositoryViewModel[]> {
  if (USE_API_MOCKS) {
    const connected = await repositoryMock.listViewModels(true);
    const available = await repositoryMock.listViewModels(false);
    return [...available, ...connected];
  }

  const page = await repositoryService.list({ page: 1, limit: 100 });
  return page.items.map((repo) => toRepositoryViewModel(repo));
}

export function useRepositories() {
  return useQuery({
    queryKey: repositoryKeys.list(true),
    queryFn: fetchConnectedRepositories,
  });
}

export function useAccessibleGithubRepositories(enabled = true) {
  return useQuery({
    queryKey: repositoryKeys.accessible(),
    queryFn: fetchAccessibleRepositories,
    enabled,
  });
}

export function useRepositoryStats(repositories: RepositoryViewModel[] = []) {
  return useMemo(() => computeRepositoryStats(repositories), [repositories]);
}

export function useFilteredRepositories(
  repositories: RepositoryViewModel[] = [],
  filters: RepositoryListFilters
) {
  return useMemo(
    () => filterAndSortRepositories(repositories, filters),
    [repositories, filters]
  );
}

export function useRepositoryLanguages(repositories: RepositoryViewModel[] = []) {
  return useMemo(() => {
    const set = new Set<string>();
    for (const repo of repositories) {
      if (repo.language && repo.language !== "Unknown") {
        set.add(repo.language);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [repositories]);
}

export function useConnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repositoryId: string) => {
      if (USE_API_MOCKS) {
        await repositoryMock.connect(repositoryId);
        return;
      }
      await repositoryService.connect(repositoryId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
    },
  });
}

export function useDisconnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repositoryId: string) => {
      if (USE_API_MOCKS) {
        await repositoryMock.disconnect(repositoryId);
        return;
      }
      await repositoryService.disconnect(repositoryId);
    },
    onSuccess: async (_data, repositoryId) => {
      await queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
      await queryClient.invalidateQueries({
        queryKey: repositoryKeys.detail(repositoryId),
      });
    },
  });
}

export function useReindexRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repositoryId: string) => {
      if (USE_API_MOCKS) {
        return repositoryMock.reindex(repositoryId);
      }
      return repositoryService.reindex(repositoryId);
    },
    onSuccess: async (_data, repositoryId) => {
      await queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
      await queryClient.invalidateQueries({
        queryKey: repositoryKeys.detail(repositoryId),
      });
    },
  });
}

export const INDEXING_STATUS_FILTER_OPTIONS: Array<
  IndexingStatus | "all"
> = ["all", "PENDING", "INDEXING", "COMPLETED", "FAILED", "OUTDATED"];
