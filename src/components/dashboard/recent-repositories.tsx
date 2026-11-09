import Link from "next/link";
import { GitBranchIcon } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelativeTime } from "@/components/shared/relative-time";
import { formatNumber } from "@/lib/format";
import type { Repository } from "@/types";

interface RecentRepositoriesProps {
  repositories: Repository[];
}

export function RecentRepositories({ repositories }: RecentRepositoriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent repositories</CardTitle>
        <CardDescription>Latest repositories connected to CodeMind.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/repositories" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {repositories.length === 0 ? (
          <EmptyState
            icon={GitBranchIcon}
            title="No repositories yet"
            description="Connect a GitHub repository to start indexing and chatting with your code."
            action={{ label: "Add Repository", href: "/repositories" }}
            className="border-0 bg-transparent py-8"
          />
        ) : (
          <ul className="divide-y divide-border">
            {repositories.map((repository) => (
              <li key={repository.id}>
                <Link
                  href="/repositories"
                  className="flex items-start gap-3 rounded-lg py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
