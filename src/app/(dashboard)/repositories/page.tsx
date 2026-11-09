import type { Metadata } from "next";
import { GitBranchIcon, PlusIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelativeTime } from "@/components/shared/relative-time";
import { formatNumber } from "@/lib/format";
import { mockRepositories } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Repositories",
};

export default function RepositoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Repositories"
        description="Manage connected GitHub repositories and indexing status."
        actions={
          <Button>
            <PlusIcon />
            Add Repository
          </Button>
        }
      />

      {mockRepositories.length === 0 ? (
        <EmptyState
          icon={GitBranchIcon}
          title="No repositories connected"
          description="Add a GitHub repository to begin semantic indexing and code-aware chat."
          action={{ label: "Add Repository", href: "/repositories" }}
        />
      ) : (
        <div className="grid gap-4">
          {mockRepositories.map((repository) => (
            <Card key={repository.id}>
              <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{repository.fullName}</CardTitle>
                    <StatusBadge status={repository.status} />
                  </div>
                  <CardDescription>{repository.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span>{repository.language}</span>
                <span>{formatNumber(repository.stars)} stars</span>
                <span>{formatNumber(repository.fileCount)} files</span>
                <RelativeTime value={repository.updatedAt} prefix="Updated" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
