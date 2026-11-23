import Link from "next/link";
import { MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelativeTime } from "@/components/shared/relative-time";
import type { Conversation } from "@/types";

interface RecentConversationsProps {
  conversations: Conversation[];
}

export function RecentConversations({ conversations }: RecentConversationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent conversations</CardTitle>
        <CardDescription>Latest repository-aware chats.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/chat" />}>
            Open chat
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquareIcon}
            title="No conversations yet"
            description="Ask CodeMind a question about an indexed repository."
            action={{ label: "Ask CodeMind", href: "/chat" }}
            className="border-0 bg-transparent py-8"
          />
        ) : (
          <ul className="divide-y divide-border">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  href={`/chat?repositoryId=${conversation.repositoryId}`}
                  className="flex items-start gap-3 rounded-lg py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                    <MessageSquareIcon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="line-clamp-1 text-sm font-medium text-foreground">
                      {conversation.title}
                    </span>
                    <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{conversation.repositoryName}</span>
                      <span>{conversation.messageCount} messages</span>
                      <RelativeTime value={conversation.updatedAt} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
