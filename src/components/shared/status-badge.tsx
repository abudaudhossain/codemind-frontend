import type { ComponentType } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  LoaderCircleIcon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  INDEXING_STATUS_LABELS,
  normalizeIndexingStatus,
} from "@/lib/repository-status";
import { cn } from "@/lib/utils";
import type { IndexingStatus, RepositoryStatus } from "@/types";

const STATUS_STYLES: Record<IndexingStatus, string> = {
  PENDING: "border-border bg-muted text-muted-foreground",
  INDEXING:
    "border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning",
  COMPLETED: "border-success/30 bg-success/10 text-success",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
  OUTDATED: "border-brand/30 bg-brand/10 text-brand",
};

const STATUS_ICONS: Record<
  IndexingStatus,
  ComponentType<{ className?: string }>
> = {
  PENDING: Clock3Icon,
  INDEXING: LoaderCircleIcon,
  COMPLETED: CheckCircle2Icon,
  FAILED: XCircleIcon,
  OUTDATED: RefreshCwIcon,
};

interface StatusBadgeProps {
  status: IndexingStatus | RepositoryStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const normalized = normalizeIndexingStatus(status);
  const Icon = STATUS_ICONS[normalized] ?? AlertTriangleIcon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md font-normal",
        STATUS_STYLES[normalized],
        className
      )}
    >
      {showIcon ? (
        <Icon
          className={cn(
            "size-3",
            normalized === "INDEXING" && "animate-spin"
          )}
          aria-hidden
        />
      ) : null}
      {INDEXING_STATUS_LABELS[normalized]}
    </Badge>
  );
}
