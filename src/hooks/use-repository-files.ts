"use client";

import { useQuery } from "@tanstack/react-query";
import { USE_API_MOCKS } from "@/lib/feature-flags";
import { repositoryFilesMock } from "@/mocks/repository-files.mock";
import { repositoryService } from "@/services/repository.service";
import type { FileTreeNode, RepositoryFileContent } from "@/types";

export const repositoryFileKeys = {
  all: ["repository-files"] as const,
  tree: (repositoryId: string) =>
    [...repositoryFileKeys.all, "tree", repositoryId] as const,
  content: (repositoryId: string, path: string) =>
    [...repositoryFileKeys.all, "content", repositoryId, path] as const,
};

async function fetchFileTree(repositoryId: string): Promise<FileTreeNode[]> {
  if (USE_API_MOCKS) {
    return repositoryFilesMock.getFileTree(repositoryId);
  }
  return repositoryService.getFileTree(repositoryId);
}

async function fetchFileContent(
  repositoryId: string,
  path: string
): Promise<RepositoryFileContent | null> {
  if (USE_API_MOCKS) {
    return repositoryFilesMock.getFileContent(repositoryId, path);
  }
  return repositoryService.getFileContent(repositoryId, path);
}

export function useRepositoryFileTree(repositoryId: string) {
  return useQuery<FileTreeNode[]>({
    queryKey: repositoryFileKeys.tree(repositoryId),
    queryFn: () => fetchFileTree(repositoryId),
    enabled: Boolean(repositoryId),
  });
}

export function useRepositoryFileContent(
  repositoryId: string,
  path: string | null
) {
  return useQuery<RepositoryFileContent | null>({
    queryKey: repositoryFileKeys.content(repositoryId, path ?? ""),
    queryFn: () => {
      if (!path) return Promise.resolve(null);
      return fetchFileContent(repositoryId, path);
    },
    enabled: Boolean(repositoryId && path),
  });
}
