"use client";

import { useMutation } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";

export function useRepositorySearch() {
  return useMutation({
    mutationFn: ({
      query,
      repositoryId,
    }: {
      query: string;
      repositoryId?: string;
    }) => searchService.search(query, repositoryId),
  });
}
