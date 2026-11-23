import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  GitBranchIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RepositoryStatsSummary } from "@/types";

interface RepositoryStatsProps {
  stats: RepositoryStatsSummary;
}

const STAT_ITEMS = [
  {
    key: "total" as const,
    label: "Connected",
    hint: "Total repositories",
    icon: GitBranchIcon,
    iconClassName: "text-muted-foreground",
    valueClassName: "text-foreground",
  },
  {
    key: "completed" as const,
    label: "Indexed",
    hint: "Ready for chat",
    icon: CheckCircle2Icon,
    iconClassName: "text-success",
    valueClassName: "text-foreground",
  },
  {
    key: "indexing" as const,
    label: "Indexing",
    hint: "In progress",
    icon: LoaderCircleIcon,
    iconClassName: "text-warning",
    valueClassName: "text-foreground",
  },
  {
    key: "failed" as const,
    label: "Failed",
    hint: "Needs attention",
    icon: AlertTriangleIcon,
    iconClassName: "text-destructive",
    valueClassName: "text-foreground",
  },
];

export function RepositoryStats({ stats }: RepositoryStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_ITEMS.map(
        ({ key, label, hint, icon: Icon, iconClassName, valueClassName }) => (
          <Card key={key} size="sm" className="shadow-xs">
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <CardDescription className="text-xs font-medium tracking-wide uppercase">
                    {label}
                  </CardDescription>
                  <p className="text-[11px] text-muted-foreground">{hint}</p>
                </div>
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg border border-border bg-muted/40",
                    iconClassName
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      key === "indexing" && stats.indexing > 0 && "animate-spin"
                    )}
                    aria-hidden
                  />
                </span>
              </div>
              <CardTitle
                className={cn(
                  "text-2xl font-semibold tracking-tight",
                  valueClassName
                )}
              >
                {formatNumber(stats[key])}
              </CardTitle>
            </CardHeader>
          </Card>
        )
      )}
    </div>
  );
}
