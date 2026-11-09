"use client";

import { useMemo, useState } from "react";
import {
  CheckIcon,
  LoaderCircleIcon,
  SearchIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { GithubConnectionCard } from "@/components/repository/github-connection-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useConnectGithub,
  useDisconnectGithub,
  useGithubConnection,
} from "@/hooks/use-github";
import {
  useAccessibleGithubRepositories,
  useConnectRepository,
} from "@/hooks/use-repositories";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { RepositoryViewModel } from "@/types";

interface AddRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRepositoryDialog({
  open,
  onOpenChange,
}: AddRepositoryDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const connectionQuery = useGithubConnection();
  const connectGithub = useConnectGithub();
  const disconnectGithub = useDisconnectGithub();
  const accessibleQuery = useAccessibleGithubRepositories(
    open && Boolean(connectionQuery.data?.connected)
  );
  const connectRepository = useConnectRepository();

  const availableRepos = useMemo(() => {
    const items = accessibleQuery.data ?? [];
    const query = search.trim().toLowerCase();
    return items.filter((repo) => {
      if (repo.connected) return false;
      if (!query) return true;
      return `${repo.fullName} ${repo.name}`.toLowerCase().includes(query);
    });
  }, [accessibleQuery.data, search]);

  const selected = availableRepos.find((repo) => repo.id === selectedId) ?? null;

  async function handleImport() {
    if (!selected) {
      setFormError("Select a repository to import.");
      return;
    }

    setFormError(null);
    try {
      await connectRepository.mutateAsync(selected.id);
      setSelectedId(null);
      setSearch("");
      onOpenChange(false);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setSelectedId(null);
      setSearch("");
      setFormError(null);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add repository</DialogTitle>
          <DialogDescription>
            Connect GitHub, choose an accessible repository, then import it into
            CodeMind.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <GithubConnectionCard
            connection={connectionQuery.data}
            isLoading={connectionQuery.isLoading}
            isConnecting={connectGithub.isPending}
            isDisconnecting={disconnectGithub.isPending}
            errorMessage={
              connectGithub.error
                ? getErrorMessage(connectGithub.error)
                : disconnectGithub.error
                  ? getErrorMessage(disconnectGithub.error)
                  : null
            }
            onConnect={() => {
              setFormError(null);
              connectGithub.mutate();
            }}
            onDisconnect={() => {
              setFormError(null);
              disconnectGithub.mutate();
            }}
          />

          {connectionQuery.data?.connected ? (
            <div className="space-y-3 rounded-xl border border-border p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <GithubIcon className="size-4" aria-hidden />
                Select a repository
              </div>

              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search accessible repositories"
                  className="pl-8"
                />
              </div>

              {accessibleQuery.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <LoaderCircleIcon className="size-4 animate-spin" />
                  Loading repositories…
                </div>
              ) : accessibleQuery.isError ? (
                <p className="py-6 text-center text-sm text-destructive">
                  {getErrorMessage(accessibleQuery.error)}
                </p>
              ) : availableRepos.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No importable repositories found. All accessible repos may
                  already be connected.
                </p>
              ) : (
                <ScrollArea className="h-56 rounded-lg border border-border">
                  <ul className="divide-y divide-border">
                    {availableRepos.map((repo) => (
                      <RepositoryOption
                        key={repo.id}
                        repository={repo}
                        selected={selectedId === repo.id}
                        onSelect={() => setSelectedId(repo.id)}
                      />
                    ))}
                  </ul>
                </ScrollArea>
              )}

              {selected ? (
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <p className="font-medium text-foreground">
                    {selected.fullName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selected.isPrivate ? "Private" : "Public"} ·{" "}
                    {selected.language} · {selected.defaultBranch}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              !connectionQuery.data?.connected ||
              !selected ||
              connectRepository.isPending
            }
          >
            {connectRepository.isPending ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <CheckIcon />
            )}
            Import repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RepositoryOption({
  repository,
  selected,
  onSelect,
}: {
  repository: RepositoryViewModel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40",
          selected && "bg-muted/50"
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border"
          )}
        >
          {selected ? <CheckIcon className="size-3" /> : null}
        </span>
        <span className="min-w-0 space-y-1">
          <span className="block truncate text-sm font-medium">
            {repository.fullName}
          </span>
          <span className="block text-xs text-muted-foreground">
            {repository.isPrivate ? "Private" : "Public"} ·{" "}
            {repository.language} · {repository.defaultBranch}
          </span>
        </span>
      </button>
    </li>
  );
}
