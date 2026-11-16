 "use client";

import { FormEvent, useState } from "react";
import { AlertCircleIcon, LoaderCircleIcon, MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelativeTime } from "@/components/shared/relative-time";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useConversation, useConversations, useSendConversationMessage } from "@/hooks/use-conversations";
import { getErrorMessage } from "@/lib/api-error";

export default function ChatPage() {
  const conversationsQuery = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const conversations = conversationsQuery.data ?? [];
  const activeId = selectedId ?? conversations[0]?.id ?? null;
  const detailsQuery = useConversation(activeId);
  const sendMutation = useSendConversationMessage(activeId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content || !activeId) return;
    await sendMutation.mutateAsync(content);
    setMessage("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chat"
        description="Ask repository-aware questions with source citations."
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Recent threads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversationsQuery.isLoading ? (
              <LoaderCircleIcon className="mx-auto animate-spin text-muted-foreground" />
            ) : conversationsQuery.isError ? (
              <p className="text-sm text-destructive">{getErrorMessage(conversationsQuery.error)}</p>
            ) : conversations.map((conversation) => (
              <div
                key={conversation.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(conversation.id)}
                className="rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <p className="line-clamp-1 text-sm font-medium">{conversation.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {conversation.repositoryName} ·{" "}
                  <RelativeTime value={conversation.updatedAt} />
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {!activeId ? (
          <EmptyState icon={MessageSquareIcon} title="No conversations yet" description="Create a conversation from a connected repository to start asking questions." className="min-h-[420px]" />
        ) : detailsQuery.isError ? (
          <EmptyState icon={AlertCircleIcon} title="Unable to load conversation" description={getErrorMessage(detailsQuery.error)} className="min-h-[420px]" />
        ) : (
          <Card className="flex min-h-[420px] flex-col">
            <CardHeader>
              <CardTitle>{detailsQuery.data?.title ?? "Conversation"}</CardTitle>
              <CardDescription>Repository-aware conversation</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div className="flex-1 space-y-3">
                {detailsQuery.data?.messages.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border p-3 text-sm">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">{item.role ?? "message"}</p>
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a question about this repository…" disabled={sendMutation.isPending} />
                <Button type="submit" disabled={!message.trim() || sendMutation.isPending}>
                  {sendMutation.isPending ? "Sending…" : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
