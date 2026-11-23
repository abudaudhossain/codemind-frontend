"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  Code2Icon,
  FolderTreeIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { CodeViewer } from "@/components/code-viewer/code-viewer";
import { FileTree } from "@/components/repository/file-tree";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositoryDetails } from "@/hooks/use-repository-details";
import {
  useRepositoryFileContent,
  useRepositoryFileTree,
} from "@/hooks/use-repository-files";
import { getErrorMessage } from "@/lib/api-error";
import {
  countFiles,
  filterFileTree,
  findFirstFilePath,
} from "@/lib/file-tree";
import { cn } from "@/lib/utils";

interface FileExplorerViewProps {
  repositoryId: string;
}

export function FileExplorerView({ repositoryId }: FileExplorerViewProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [treeQueryText, setTreeQueryText] = useState("");
  const [mobilePanel, setMobilePanel] = useState<"tree" | "viewer">("tree");

  const detailsQuery = useRepositoryDetails(repositoryId);
  const treeQuery = useRepositoryFileTree(repositoryId);
  const contentQuery = useRepositoryFileContent(repositoryId, selectedPath);

  const repository = detailsQuery.data;
  const repositoryName =
    repository?.fullName ?? repository?.name ?? "Repository";

  const fileCount = useMemo(
    () => countFiles(treeQuery.data ?? []),
    [treeQuery.data]
  );

  const filteredTree = useMemo(
    () => filterFileTree(treeQuery.data ?? [], treeQueryText),
    [treeQuery.data, treeQueryText]
  );

  useEffect(() => {
    if (!treeQuery.data?.length || selectedPath) return;
    const firstPath = findFirstFilePath(treeQuery.data);
    if (firstPath) setSelectedPath(firstPath);
  }, [treeQuery.data, selectedPath]);

  function handleSelectFile(path: string) {
    setSelectedPath(path);
    setMobilePanel("viewer");
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-144 flex-col gap-4">
      <PageHeader
        title="Files"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span>Browse indexed source in {repositoryName}.</span>
            {repository ? <StatusBadge status={repository.status} /> : null}
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              render={<Link href={`/repositories/${repositoryId}`} />}
            >
              <ArrowLeftIcon />
              Details
            </Button>
            <Button
              render={
                <Link href={`/chat?repositoryId=${repositoryId}`} />
              }
            >
              <MessageSquareIcon />
              Chat
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between gap-2 lg:hidden">
        <Button
          type="button"
          variant={mobilePanel === "tree" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setMobilePanel("tree")}
        >
          <PanelLeftIcon />
          Tree
        </Button>
        <Button
          type="button"
          variant={mobilePanel === "viewer" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setMobilePanel("viewer")}
          disabled={!selectedPath}
        >
          <Code2Icon />
          Viewer
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-xs lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside
          className={cn(
            "min-h-0 flex-col border-border lg:flex lg:border-r",
            mobilePanel === "tree" ? "flex" : "hidden"
          )}
        >
          <div className="space-y-3 border-b border-border px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">File tree</p>
                <p className="text-[11px] text-muted-foreground">
                  {treeQuery.isLoading
                    ? "Loading…"
                    : `${fileCount} indexed ${fileCount === 1 ? "file" : "files"}`}
                </p>
              </div>
              <FolderTreeIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </div>

            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={treeQueryText}
                onChange={(event) => setTreeQueryText(event.target.value)}
                placeholder="Filter files"
                className="h-8 pl-8 pr-8 text-sm"
                aria-label="Filter files"
              />
              {treeQueryText ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                  aria-label="Clear file filter"
                  onClick={() => setTreeQueryText("")}
                >
                  <XIcon />
                </Button>
              ) : null}
            </div>
          </div>

          {treeQuery.isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-6"
                  style={{ width: `${70 - (index % 4) * 8}%` }}
                />
              ))}
            </div>
          ) : treeQuery.isError ? (
            <EmptyState
              icon={AlertCircleIcon}
              title="Unable to load files"
              description={getErrorMessage(treeQuery.error)}
              className="m-3 border-0 bg-transparent py-10"
            />
          ) : !treeQuery.data?.length ? (
            <EmptyState
              icon={FolderTreeIcon}
              title="No indexed files"
              description="Run sync and fetch-source on this repository, then refresh to browse real files."
              className="m-3 border-0 bg-transparent py-10"
            />
          ) : filteredTree.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matching files"
              description="Try a different file name or path."
              action={{
                label: "Clear filter",
                onClick: () => setTreeQueryText(""),
              }}
              className="m-3 border-0 bg-transparent py-10"
            />
          ) : (
            <ScrollArea className="min-h-0 flex-1">
              <FileTree
                nodes={filteredTree}
                selectedPath={selectedPath}
                onSelectFile={handleSelectFile}
                forceExpand={Boolean(treeQueryText.trim())}
              />
            </ScrollArea>
          )}
        </aside>

        <section
          className={cn(
            "min-h-0 min-w-0",
            mobilePanel === "viewer" ? "flex" : "hidden lg:flex"
          )}
        >
          {!selectedPath ? (
            <EmptyState
              icon={Code2Icon}
              title="Select a file"
              description="Choose a file from the tree to view its source."
              className="h-full rounded-none border-0"
            />
          ) : contentQuery.isLoading ? (
            <div className="flex h-full w-full flex-col gap-3 p-4">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="mt-2 min-h-0 flex-1 w-full" />
            </div>
          ) : contentQuery.isError ? (
            <EmptyState
              icon={AlertCircleIcon}
              title="Unable to load file"
              description={getErrorMessage(contentQuery.error)}
              className="h-full rounded-none border-0"
            />
          ) : !contentQuery.data ? (
            <EmptyState
              icon={Code2Icon}
              title="File unavailable"
              description="No content was returned for the selected path."
              className="h-full rounded-none border-0"
            />
          ) : (
            <CodeViewer
              path={contentQuery.data.path}
              content={contentQuery.data.content}
              language={contentQuery.data.language}
              isIndexed={contentQuery.data.isIndexed}
              updatedAt={contentQuery.data.updatedAt}
              className="h-full w-full rounded-none border-0"
            />
          )}
        </section>
      </div>
    </div>
  );
}
