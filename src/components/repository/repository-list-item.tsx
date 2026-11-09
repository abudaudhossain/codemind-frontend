"use client";

import Link from "next/link";
import {
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  EyeIcon,
  FolderTreeIcon,
  GitBranchIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RepositoryViewModel } from "@/types";
import { cn } from "@/lib/utils";

interface RepositoryListItemProps {
  repository: RepositoryViewModel;
  onReindex?: (repository: RepositoryViewModel) => void;
  onRemove?: (repository: RepositoryViewModel) => void;
  className?: string;
}

export function RepositoryListItem({
  repository,
  onReindex,
  onRemove,
  className,
}: RepositoryListItemProps) {
  const detailsHref = `/repositories/${repository.id}`;
  const filesHref = `/repositories/${repository.id}/files`;
  const chatHref = `/chat?repositoryId=${repository.id}`;

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/20",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
          <GitBranchIcon className="size-4" aria-hidden />
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={detailsHref}
                  className="truncate text-sm font-medium text-foreground hover:underline"
                >
                  {repository.name}
                </Link>
                <StatusBadge status={repository.status} />
                <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {repository.isPrivate ? "Private" : "Public"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{repository.owner}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${repository.fullName}`}
                  />
                }
              >
                <EllipsisVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  render={<Link href={detailsHref} />}
                >
                  <EyeIcon />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={filesHref} />}>
                  <FolderTreeIcon />
                  Browse files
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={chatHref} />}>
                  <MessageSquareIcon />
                  Ask CodeMind
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={
                    <a
                      href={repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ExternalLinkIcon />
                  Open on GitHub
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onReindex?.(repository)}
                  disabled={repository.status === "INDEXING"}
                >
                  <RefreshCwIcon />
                  Re-index
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onRemove?.(repository)}
                >
                  <Trash2Icon />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {repository.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {repository.description}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{repository.language}</span>
            <span>Branch {repository.defaultBranch}</span>
            {repository.lastIndexedAt ? (
              <RelativeTime
                value={repository.lastIndexedAt}
                prefix="Indexed"
              />
            ) : (
              <span>Not indexed yet</span>
            )}
            <RelativeTime value={repository.updatedAt} prefix="Updated" />
          </div>
        </div>
      </div>
    </article>
  );
}
