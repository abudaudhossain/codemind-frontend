"use client";

import { useQuery } from "@tanstack/react-query";
import { repositoryFilesMock } from "@/mocks/repository-files.mock";
import type { FileTreeNode, RepositoryFileContent } from "@/types";

/**
 * File tree + content hooks.
 * CAP currently has no file list/content HTTP endpoints, so this module
 * exclusively uses `mocks/repository-files.mock.ts`.
 * When CAP adds verified endpoints, replace the mock calls here only.
 */

export const repositoryFileKeys = {
  all: ["repository-files"] as const,
  tree: (repositoryId: string) =>
    [...repositoryFileKeys.all, "tree", repositoryId] as const,
  content: (repositoryId: string, path: string) =>
    [...repositoryFileKeys.all, "content", repositoryId, path] as const,
};

export function useRepositoryFileTree(repositoryId: string) {
  return useQuery<FileTreeNode[]>({
    queryKey: repositoryFileKeys.tree(repositoryId),
    queryFn: () => repositoryFilesMock.getFileTree(repositoryId),
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
      return repositoryFilesMock.getFileContent(repositoryId, path);
    },
    enabled: Boolean(repositoryId && path),
  });
}
