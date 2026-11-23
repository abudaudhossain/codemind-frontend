"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationService } from "@/services/conversation.service";

export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
  details: (id: string) => [...conversationKeys.all, "detail", id] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: conversationService.list,
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: conversationKeys.details(id ?? ""),
    queryFn: () => conversationService.details(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      repositoryId,
      title,
    }: {
      repositoryId: string;
      title?: string;
    }) => conversationService.create(repositoryId, title),
    onSuccess: (created) => {
      queryClient.setQueryData(
        conversationKeys.list(),
        (current: Awaited<
          ReturnType<typeof conversationService.list>
        > | undefined) => {
          if (!current) return [created];
          if (current.some((item) => item.id === created.id)) return current;
          return [created, ...current];
        }
      );
      void queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
}

export function useSendConversationMessage(id: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      conversationService.sendMessage(id as string, content),
    onSuccess: (result) => {
      if (id) {
        queryClient.setQueryData(
          conversationKeys.details(id),
          (current: Awaited<
            ReturnType<typeof conversationService.details>
          > | undefined) => {
            if (!current) return current;
            return {
              ...current,
              updatedAt: new Date().toISOString(),
              messages: [
                ...current.messages,
                result.userMessage,
                result.assistantMessage,
              ],
            };
          }
        );
      }
      void queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
}
