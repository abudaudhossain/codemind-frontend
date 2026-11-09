import { Badge } from "@/components/ui/badge";
import type { RepositoryStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<RepositoryStatus, string> = {
  pending: "Pending",
  indexing: "Indexing",
  indexed: "Indexed",
  failed: "Failed",
};

const STATUS_STYLES: Record<RepositoryStatus, string> = {
  pending: "border-border bg-muted text-muted-foreground",
  indexing: "border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning",
  indexed: "border-success/30 bg-success/10 text-success",
  failed: "border-destructive/30 bg-destructive/10 text-destructive",
};

interface StatusBadgeProps {
  status: RepositoryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md font-normal", STATUS_STYLES[status], className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
