"use client";

import { useMutation } from "@tanstack/react-query";
import { USE_API_MOCKS } from "@/lib/feature-flags";
import { repositoryService } from "@/services/repository.service";
import type { AskRepositoryResult } from "@/types";

async function askRepository(
  repositoryId: string,
  question: string
): Promise<AskRepositoryResult> {
  if (USE_API_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      answer: `Mock answer for "${question}" in repository ${repositoryId}. Authentication and related logic typically live under src/iam/auth [SOURCE 1].`,
      model: "mock-model",
      sources: [
        {
          citationId: "SOURCE 1",
          filePath: "src/iam/auth/services/auth.service.ts",
          startLine: 1,
          endLine: 40,
          similarity: 0.91,
          url: "#",
        },
      ],
    };
  }

  return repositoryService.ask(repositoryId, question);
}

export function useAskRepository() {
  return useMutation({
    mutationFn: ({
      repositoryId,
      question,
    }: {
      repositoryId: string;
      question: string;
    }) => askRepository(repositoryId, question),
  });
}
