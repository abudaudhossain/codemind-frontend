import { BotIcon, ExternalLinkIcon, UserIcon } from "lucide-react";
import { RelativeTime } from "@/components/shared/relative-time";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@/types";

interface ChatMessageProps {
  message: ConversationMessage;
}

function formatSourceLabel(source: NonNullable<ConversationMessage["sources"]>[number]) {
  const start = source.startLine ? `:${source.startLine}` : "";
  const end =
    source.endLine && source.endLine !== source.startLine
      ? `-${source.endLine}`
      : "";
  return `${source.filePath}${start}${end}`;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border",
          isUser
            ? "border-brand/25 bg-brand/10 text-brand"
            : "border-border bg-muted text-muted-foreground"
        )}
        aria-hidden
      >
        {isUser ? (
          <UserIcon className="size-3.5" />
        ) : (
          <BotIcon className="size-3.5" />
        )}
      </span>

      <div
        className={cn(
          "min-w-0 max-w-[min(100%,42rem)] space-y-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 text-[11px] text-muted-foreground",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="font-medium text-foreground/80">
            {isUser ? "You" : "CodeMind"}
          </span>
          <span aria-hidden>·</span>
          <RelativeTime value={message.createdAt} />
        </div>

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs",
            isUser
              ? "rounded-tr-md bg-brand text-brand-foreground"
              : "rounded-tl-md border border-border bg-card text-card-foreground"
          )}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        </div>

        {!isUser && message.model ? (
          <p className="text-[11px] text-muted-foreground">
            Answered with {message.model}
          </p>
        ) : null}

        {!isUser && message.sources && message.sources.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Sources
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {message.sources.map((source) => (
                <li key={`${message.id}-${source.citationId}-${source.filePath}`}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                    title={formatSourceLabel(source)}
                  >
                    <ExternalLinkIcon className="size-3 shrink-0 opacity-70" />
                    <span className="truncate">
                      <span className="text-muted-foreground">
                        {source.citationId}
                      </span>{" "}
                      {formatSourceLabel(source)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
