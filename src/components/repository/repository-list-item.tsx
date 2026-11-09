import Link from "next/link";
import { GitBranchIcon } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { formatNumber } from "@/lib/format";
import type { Repository } from "@/types";

interface RepositoryListItemProps {
  repository: Repository;
  href?: string;
}

export function RepositoryListItem({
  repository,
  href = "/repositories",
}: RepositoryListItemProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg border border-border px-3 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
        <GitBranchIcon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {repository.fullName}
          </span>
          <StatusBadge status={repository.status} />
        </span>
        <span className="line-clamp-1 text-xs text-muted-foreground">
          {repository.description}
        </span>
        <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{repository.language}</span>
          <span>{formatNumber(repository.stars)} stars</span>
          <span>{formatNumber(repository.fileCount)} files</span>
          <RelativeTime value={repository.updatedAt} prefix="Updated" />
        </span>
      </span>
    </Link>
  );
}
