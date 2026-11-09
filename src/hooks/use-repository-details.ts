"use client";

import { useQuery } from "@tanstack/react-query";
import { USE_API_MOCKS } from "@/lib/feature-flags";
import { toRepositoryViewModel } from "@/lib/repository-status";
import { repositoryMock } from "@/mocks/repository.mock";
import { repositoryService } from "@/services/repository.service";
import { repositoryKeys } from "@/hooks/use-repositories";
import type { RepositoryViewModel } from "@/types";

/**
 * CAP has no GET /github/repositories/:id.
 * Live mode resolves details by scanning the authenticated list.
 */
async function fetchRepositoryDetails(
  repositoryId: string
): Promise<RepositoryViewModel> {
  if (USE_API_MOCKS) {
    const repo = await repositoryMock.getById(repositoryId);
    if (!repo) {
      throw new Error("Repository not found");
    }
    return repo;
  }

  const page = await repositoryService.list({ page: 1, limit: 100 });
  const match = page.items.find((item) => item.id === repositoryId);
  if (!match) {
    throw new Error("Repository not found");
  }
  return toRepositoryViewModel(match);
}

export function useRepositoryDetails(repositoryId: string) {
  return useQuery({
    queryKey: repositoryKeys.detail(repositoryId),
    queryFn: () => fetchRepositoryDetails(repositoryId),
    enabled: Boolean(repositoryId),
  });
}
