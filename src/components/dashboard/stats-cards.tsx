import {
  FileCode2Icon,
  GitBranchIcon,
  MessageSquareIcon,
  SparklesIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const STAT_ITEMS = [
  {
    key: "totalRepositories" as const,
    label: "Total repositories",
    icon: GitBranchIcon,
  },
  {
    key: "indexedRepositories" as const,
    label: "Indexed repositories",
    icon: SparklesIcon,
  },
  {
    key: "totalIndexedFiles" as const,
    label: "Indexed files",
    icon: FileCode2Icon,
  },
  {
    key: "totalConversations" as const,
    label: "Conversations",
    icon: MessageSquareIcon,
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_ITEMS.map(({ key, label, icon: Icon }) => (
        <Card key={key} size="sm">
          <CardHeader className="gap-3">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>{label}</CardDescription>
              <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                <Icon className="size-4" aria-hidden />
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {formatNumber(stats[key])}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
