import Link from "next/link";
import { MessageSquareIcon } from "lucide-react";
import { RelativeTime } from "@/components/shared/relative-time";
import type { Conversation } from "@/types";

interface ConversationListItemProps {
  conversation: Conversation;
  href?: string;
}

export function ConversationListItem({
  conversation,
  href = `/chat?repositoryId=${conversation.repositoryId}`,
}: ConversationListItemProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg border border-border px-3 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  );
}
