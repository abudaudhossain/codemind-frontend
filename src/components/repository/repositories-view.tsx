"use client";

import { useState } from "react";
import { AlertCircleIcon, GitBranchIcon, PlusIcon } from "lucide-react";
import { AddRepositoryDialog } from "@/components/repository/add-repository-dialog";
import { ConfirmActionDialog } from "@/components/repository/confirm-action-dialog";
import { RepositoryFilters } from "@/components/repository/repository-filters";
import { RepositoryListItem } from "@/components/repository/repository-list-item";
import { RepositoryStats } from "@/components/repository/repository-stats";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  RepositoryListSkeleton,
  StatsCardsSkeleton,
} from "@/components/shared/loading-skeletons";
import { Button } from "@/components/ui/button";
import {
  useDisconnectRepository,
  useFilteredRepositories,
  useReindexRepository,
  useRepositories,
  useRepositoryLanguages,
  useRepositoryStats,
} from "@/hooks/use-repositories";
import { getErrorMessage } from "@/lib/api-error";
import type { RepositoryListFilters, RepositoryViewModel } from "@/types";

const INITIAL_FILTERS: RepositoryListFilters = {
  search: "",
  status: "all",
  language: "all",
  sort: "recently-added",
};

export function RepositoriesView() {
  const [filters, setFilters] = useState<RepositoryListFilters>(INITIAL_FILTERS);
  const [addOpen, setAddOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<RepositoryViewModel | null>(
    null
  );
  const [pendingReindex, setPendingReindex] =
    useState<RepositoryViewModel | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const repositoriesQuery = useRepositories();
  const repositories = repositoriesQuery.data ?? [];
  const stats = useRepositoryStats(repositories);
  const languages = useRepositoryLanguages(repositories);
  const filtered = useFilteredRepositories(repositories, filters);

  const disconnectMutation = useDisconnectRepository();
  const reindexMutation = useReindexRepository();

  async function confirmRemove() {
    if (!pendingRemove) return;
    setActionError(null);
    try {
      await disconnectMutation.mutateAsync(pendingRemove.id);
      setPendingRemove(null);
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  async function confirmReindex() {
    if (!pendingReindex) return;
    setActionError(null);
    try {
      await reindexMutation.mutateAsync(pendingReindex.id);
      setPendingReindex(null);
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repositories"
        description="Connect GitHub repositories, track indexing health, and open code-aware chat."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <PlusIcon />
            Add Repository
          </Button>
        }
      />

      {repositoriesQuery.isLoading ? (
        <>
          <StatsCardsSkeleton />
          <RepositoryListSkeleton rows={5} />
        </>
      ) : repositoriesQuery.isError ? (
        <EmptyState
          icon={AlertCircleIcon}
          title="Unable to load repositories"
          description={getErrorMessage(repositoriesQuery.error)}
          action={{
            label: "Retry",
            onClick: () => void repositoriesQuery.refetch(),
          }}
        />
      ) : (
        <>
          <RepositoryStats stats={stats} />

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="border-b border-border px-4 py-4">
              <RepositoryFilters
                filters={filters}
                languages={languages}
                resultCount={filtered.length}
                totalCount={repositories.length}
                onChange={setFilters}
                onReset={() => setFilters(INITIAL_FILTERS)}
              />
            </div>

            {actionError ? (
              <div
                className="border-b border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-destructive"
                role="alert"
              >
                {actionError}
              </div>
            ) : null}

            {repositories.length === 0 ? (
              <EmptyState
                icon={GitBranchIcon}
                title="No repositories connected"
                description="Add a GitHub repository to begin semantic indexing and code-aware chat."
                action={{
                  label: "Add Repository",
                  onClick: () => setAddOpen(true),
                }}
                className="rounded-none border-0 bg-transparent"
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={GitBranchIcon}
                title="No matching repositories"
                description="Try adjusting search, status, or language filters."
                action={{
                  label: "Clear filters",
                  onClick: () => setFilters(INITIAL_FILTERS),
                }}
                className="rounded-none border-0 bg-transparent"
              />
            ) : (
              <div className="divide-y divide-border" role="list">
                {filtered.map((repository) => (
                  <RepositoryListItem
                    key={repository.id}
                    repository={repository}
                    onRemove={setPendingRemove}
                    onReindex={setPendingReindex}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <AddRepositoryDialog open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmActionDialog
        open={Boolean(pendingRemove)}
        onOpenChange={(open) => {
          if (!open) setPendingRemove(null);
        }}
        title="Remove repository"
        description={
          pendingRemove
            ? `Disconnect ${pendingRemove.fullName} from CodeMind? Indexed data will no longer be available for chat until you reconnect.`
            : null
        }
        confirmLabel="Remove"
        confirmingLabel="Removing…"
        tone="destructive"
        isPending={disconnectMutation.isPending}
        onConfirm={confirmRemove}
      />

      <ConfirmActionDialog
        open={Boolean(pendingReindex)}
        onOpenChange={(open) => {
          if (!open) setPendingReindex(null);
        }}
        title={
          pendingReindex?.status === "FAILED"
            ? "Retry indexing"
            : pendingReindex?.status === "PENDING"
              ? "Start indexing"
              : "Re-index repository"
        }
        description={
          pendingReindex
            ? `Run sync, source fetch, chunking, and embeddings for ${pendingReindex.fullName}?`
            : null
        }
        confirmLabel={
          pendingReindex?.status === "FAILED"
            ? "Retry"
            : pendingReindex?.status === "PENDING"
              ? "Start"
              : "Re-index"
        }
        confirmingLabel="Indexing…"
        isPending={reindexMutation.isPending}
        onConfirm={confirmReindex}
      />
    </div>
  );
}
