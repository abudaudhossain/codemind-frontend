import {
  AlertCircleIcon,
  GitBranchPlusIcon,
  MessageSquareIcon,
  SearchIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelativeTime } from "@/components/shared/relative-time";
import type { ActivityItem, ActivityType } from "@/types";

interface RecentActivityProps {
  activity: ActivityItem[];
}

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  repository_added: GitBranchPlusIcon,
  indexing_completed: SparklesIcon,
  indexing_failed: AlertCircleIcon,
  conversation_started: MessageSquareIcon,
  search_performed: SearchIcon,
};

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>What happened across your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState
            icon={SparklesIcon}
            title="No activity yet"
            description="Repository indexing and chat events will show up here."
            className="border-0 bg-transparent py-8"
          />
        ) : (
          <ul className="space-y-4">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type];
              return (
                <li key={item.id} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground/80">
                      <RelativeTime value={item.timestamp} />
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
