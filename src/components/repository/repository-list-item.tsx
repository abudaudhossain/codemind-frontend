"use client";

import Link from "next/link";
import {
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  EyeIcon,
  FolderTreeIcon,
  GitBranchIcon,
  LoaderCircleIcon,
  LockIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
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
import { getLanguageColor } from "@/lib/language-color";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IndexingStatus, RepositoryViewModel } from "@/types";

interface RepositoryListItemProps {
  repository: RepositoryViewModel;
  onReindex?: (repository: RepositoryViewModel) => void;
  onRemove?: (repository: RepositoryViewModel) => void;
  className?: string;
}

type StatusActionConfig = {
  label: string;
  icon: typeof MessageSquareIcon;
  href?: string;
  onClick?: () => void;
  variant: "default" | "outline" | "ghost" | "secondary";
  spin?: boolean;
  canChat: boolean;
  canBrowseFiles: boolean;
  canReindex: boolean;
  reindexLabel: string;
};

function getStatusAction(
  status: IndexingStatus,
  hrefs: { details: string; files: string; chat: string },
  onReindex?: () => void
): StatusActionConfig {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Chat",
        icon: MessageSquareIcon,
        href: hrefs.chat,
        variant: "default",
        canChat: true,
        canBrowseFiles: true,
        canReindex: true,
        reindexLabel: "Re-index",
      };
    case "OUTDATED":
      return {
        label: "Re-index",
        icon: RefreshCwIcon,
        onClick: onReindex,
        variant: "outline",
        canChat: true,
        canBrowseFiles: true,
        canReindex: true,
        reindexLabel: "Re-index",
      };
    case "FAILED":
      return {
        label: "Retry",
        icon: RefreshCwIcon,
        onClick: onReindex,
        variant: "outline",
        canChat: false,
        canBrowseFiles: true,
        canReindex: true,
        reindexLabel: "Retry indexing",
      };
    case "PENDING":
      return {
        label: "Index",
        icon: RefreshCwIcon,
        onClick: onReindex,
        variant: "outline",
        canChat: false,
        canBrowseFiles: true,
        canReindex: true,
        reindexLabel: "Start indexing",
      };
    case "INDEXING":
      return {
        label: "View",
        icon: LoaderCircleIcon,
        href: hrefs.details,
        variant: "ghost",
        spin: true,
        canChat: false,
        canBrowseFiles: true,
        canReindex: false,
        reindexLabel: "Re-index",
      };
    default:
      return {
        label: "View",
        icon: EyeIcon,
        href: hrefs.details,
        variant: "ghost",
        canChat: false,
        canBrowseFiles: true,
        canReindex: false,
        reindexLabel: "Re-index",
      };
  }
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
  const shortSha = repository.latestCommitSha?.slice(0, 7) ?? null;
  const languageColor = getLanguageColor(repository.language);

  const action = getStatusAction(
    repository.status,
    { details: detailsHref, files: filesHref, chat: chatHref },
    onReindex ? () => onReindex(repository) : undefined
  );
  const ActionIcon = action.icon;

  return (
    <article
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
          <GithubIcon className="size-4" />
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Link
              href={detailsHref}
              className="truncate text-sm font-medium text-foreground outline-none hover:text-brand focus-visible:underline"
            >
              {repository.fullName}
            </Link>
            <StatusBadge status={repository.status} />
            <span className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {repository.isPrivate ? (
                <>
                  <LockIcon className="size-3" aria-hidden />
                  Private
                </>
              ) : (
                "Public"
              )}
            </span>
          </div>

          {repository.description ? (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {repository.description}
            </p>
          ) : null}

          {repository.status === "FAILED" && repository.errorMessage ? (
            <p className="line-clamp-1 text-xs text-destructive">
              {repository.errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: languageColor }}
                aria-hidden
              />
              {repository.language}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitBranchIcon className="size-3" aria-hidden />
              {repository.defaultBranch}
            </span>
            {shortSha ? (
              <span className="font-mono text-[11px]">{shortSha}</span>
            ) : null}
            {typeof repository.fileCount === "number" ? (
              <span>{formatNumber(repository.fileCount)} files</span>
            ) : null}
            {repository.lastIndexedAt ? (
              <RelativeTime
                value={repository.lastIndexedAt}
                prefix="Indexed"
              />
            ) : (
              <span>Not indexed yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-30 shrink-0 items-center justify-end gap-1 sm:w-34">
        {action.href ? (
          <Button
            variant={action.variant}
            size="sm"
            className="min-w-22"
            render={<Link href={action.href} />}
          >
            <ActionIcon className={action.spin ? "animate-spin" : undefined} />
            {action.label}
          </Button>
        ) : (
          <Button
            type="button"
            variant={action.variant}
            size="sm"
            className="min-w-22"
            onClick={action.onClick}
            disabled={!action.onClick}
          >
            <ActionIcon />
            {action.label}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`More actions for ${repository.fullName}`}
                className="text-muted-foreground"
              />
            }
          >
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuItem render={<Link href={detailsHref} />}>
              <EyeIcon />
              View details
            </DropdownMenuItem>
            {action.canBrowseFiles ? (
              <DropdownMenuItem render={<Link href={filesHref} />}>
                <FolderTreeIcon />
                Browse files
              </DropdownMenuItem>
            ) : null}
            {action.canChat ? (
              <DropdownMenuItem render={<Link href={chatHref} />}>
                <MessageSquareIcon />
                Ask CodeMind
              </DropdownMenuItem>
            ) : null}
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
            {action.canReindex ? (
              <DropdownMenuItem onClick={() => onReindex?.(repository)}>
                <RefreshCwIcon />
                {action.reindexLabel}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <LoaderCircleIcon className="animate-spin" />
                Indexing in progress
              </DropdownMenuItem>
            )}
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
    </article>
  );
}
