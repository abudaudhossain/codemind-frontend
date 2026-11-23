import Link from "next/link";
import { RelativeTime } from "@/components/shared/relative-time";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationListItemProps {
  conversation: Conversation;
  href?: string;
  active?: boolean;
  className?: string;
}

export function ConversationListItem({
  conversation,
  href = `/chat?conversationId=${conversation.id}`,
  active = false,
  className,
}: ConversationListItemProps) {
  const repoShort =
    conversation.repositoryName.split("/").pop() ??
    conversation.repositoryName;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group block rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-brand/10 text-foreground ring-1 ring-brand/20"
          : "text-foreground hover:bg-muted/60",
        className
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1">
          <span className="line-clamp-1 text-sm font-medium">
            {conversation.title}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{repoShort}</span>
            <span aria-hidden>·</span>
            <span className="shrink-0">
              {conversation.messageCount} msg
              {conversation.messageCount === 1 ? "" : "s"}
            </span>
          </span>
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          <RelativeTime value={conversation.updatedAt} />
        </span>
      </span>
    </Link>
  );
}
