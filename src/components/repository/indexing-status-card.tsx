"use client";

import {
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INDEXING_STATUS_DESCRIPTIONS } from "@/lib/repository-status";
import type { IndexingStatus } from "@/types";

interface IndexingStatusCardProps {
  status: IndexingStatus;
  lastIndexedAt: string | null;
  errorMessage?: string | null;
  onReindex?: () => void;
  isReindexing?: boolean;
}

export function IndexingStatusCard({
  status,
  lastIndexedAt,
  errorMessage,
  onReindex,
  isReindexing,
}: IndexingStatusCardProps) {
  const canReindex =
    status === "FAILED" ||
    status === "COMPLETED" ||
    status === "OUTDATED" ||
    status === "PENDING";

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Indexing status</CardTitle>
          <CardDescription>
            {INDEXING_STATUS_DESCRIPTIONS[status]}
          </CardDescription>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {lastIndexedAt ? (
            <RelativeTime value={lastIndexedAt} prefix="Last indexed" />
          ) : (
            <span>Not indexed yet</span>
          )}
        </div>

        {errorMessage ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {canReindex && onReindex ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onReindex}
            disabled={isReindexing}
          >
            <RefreshCwIcon
              className={isReindexing ? "animate-spin" : undefined}
            />
            {isReindexing ? "Re-indexing…" : "Re-index repository"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
