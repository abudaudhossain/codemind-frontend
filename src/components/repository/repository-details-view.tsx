"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  FileCode2Icon,
  FolderTreeIcon,
  LayersIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { ConfirmActionDialog } from "@/components/repository/confirm-action-dialog";
import { IndexingStatusCard } from "@/components/repository/indexing-status-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { RelativeTime } from "@/components/shared/relative-time";
import { StatsCardsSkeleton } from "@/components/shared/loading-skeletons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositoryDetails } from "@/hooks/use-repository-details";
import {
  useDisconnectRepository,
  useReindexRepository,
} from "@/hooks/use-repositories";
import { getErrorMessage } from "@/lib/api-error";
import { formatNumber } from "@/lib/format";

interface RepositoryDetailsViewProps {
  repositoryId: string;
}

export function RepositoryDetailsView({
  repositoryId,
}: RepositoryDetailsViewProps) {
  const router = useRouter();
  const detailsQuery = useRepositoryDetails(repositoryId);
  const reindexMutation = useReindexRepository();
  const disconnectMutation = useDisconnectRepository();

  const [removeOpen, setRemoveOpen] = useState(false);
  const [reindexOpen, setReindexOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const repository = detailsQuery.data;

  async function handleReindex() {
    setActionError(null);
    try {
      await reindexMutation.mutateAsync(repositoryId);
      setReindexOpen(false);
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  async function handleRemove() {
    setActionError(null);
    try {
      await disconnectMutation.mutateAsync(repositoryId);
      setRemoveOpen(false);
      router.push("/repositories");
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  if (detailsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <StatsCardsSkeleton />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (detailsQuery.isError || !repository) {
    return (
      <EmptyState
        icon={AlertCircleIcon}
        title="Repository not found"
        description={
          detailsQuery.error
            ? getErrorMessage(detailsQuery.error)
            : "This repository does not exist or is no longer connected."
        }
        action={{ label: "Back to repositories", href: "/repositories" }}
      />
    );
  }

  const metrics = [
    {
      label: "Total source files",
      value: repository.fileCount,
      icon: FileCode2Icon,
    },
    {
      label: "Indexed chunks",
      value: repository.chunkCount,
      icon: LayersIcon,
    },
    {
      label: "Generated embeddings",
      value: repository.embeddingCount,
      icon: SparklesIcon,
    },
  ].filter((metric) => typeof metric.value === "number");

  return (
    <div className="space-y-6">
      <PageHeader
        title={repository.fullName}
        description={
          repository.description || "No description provided for this repository."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              render={
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLinkIcon />
              Open GitHub
            </Button>
            <Button
              variant="outline"
              render={<Link href={`/repositories/${repository.id}/files`} />}
            >
              <FolderTreeIcon />
              Browse files
            </Button>
            <Button
              render={
                <Link href={`/chat?repositoryId=${repository.id}`} />
              }
            >
              <MessageSquareIcon />
              Ask CodeMind
            </Button>
          </div>
        }
      />

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Repository information</CardTitle>
            <CardDescription>
              Metadata synced from the connected GitHub repository.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Name" value={repository.name} />
              <InfoItem label="Owner" value={repository.owner} />
              <InfoItem label="Default branch" value={repository.defaultBranch} />
              <InfoItem
                label="Visibility"
                value={repository.isPrivate ? "Private" : "Public"}
              />
              <InfoItem label="Primary language" value={repository.language} />
              <InfoItem
                label="GitHub"
                value={
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {repository.url.replace("https://github.com/", "")}
                  </a>
                }
              />
              <InfoItem
                label="Created"
                value={<RelativeTime value={repository.createdAt} />}
              />
              <InfoItem
                label="Last updated"
                value={<RelativeTime value={repository.updatedAt} />}
              />
            </dl>
          </CardContent>
        </Card>

        <IndexingStatusCard
          status={repository.status}
          lastIndexedAt={repository.lastIndexedAt}
          errorMessage={repository.errorMessage}
          isReindexing={reindexMutation.isPending}
          onReindex={() => setReindexOpen(true)}
        />
      </div>

      {metrics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map(({ label, value, icon: Icon }) => (
            <Card key={label} size="sm">
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-3">
                  <CardDescription>{label}</CardDescription>
                  <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                </div>
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {formatNumber(value as number)}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Manage indexing and connection for this repository.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setReindexOpen(true)}
            disabled={
              reindexMutation.isPending || repository.status === "INDEXING"
            }
          >
            <RefreshCwIcon
              className={reindexMutation.isPending ? "animate-spin" : undefined}
            />
            Re-index repository
          </Button>
          <Button
            variant="destructive"
            onClick={() => setRemoveOpen(true)}
            disabled={disconnectMutation.isPending}
          >
            <Trash2Icon />
            Remove repository
          </Button>
        </CardContent>
      </Card>

      <ConfirmActionDialog
        open={reindexOpen}
        onOpenChange={setReindexOpen}
        title="Re-index repository"
        description={`Run the full indexing pipeline for ${repository.fullName}?`}
        confirmLabel="Re-index"
        confirmingLabel="Re-indexing…"
        isPending={reindexMutation.isPending}
        onConfirm={handleReindex}
      />

      <ConfirmActionDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title="Remove repository"
        description={`Disconnect ${repository.fullName} from CodeMind?`}
        confirmLabel="Remove"
        confirmingLabel="Removing…"
        tone="destructive"
        isPending={disconnectMutation.isPending}
        onConfirm={handleRemove}
      />
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
