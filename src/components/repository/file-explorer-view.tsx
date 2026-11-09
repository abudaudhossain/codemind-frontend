"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  Code2Icon,
  FolderTreeIcon,
} from "lucide-react";
import { CodeViewer } from "@/components/code-viewer/code-viewer";
import { FileTree } from "@/components/repository/file-tree";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositoryDetails } from "@/hooks/use-repository-details";
import {
  useRepositoryFileContent,
  useRepositoryFileTree,
} from "@/hooks/use-repository-files";
import { getErrorMessage } from "@/lib/api-error";

interface FileExplorerViewProps {
  repositoryId: string;
}

export function FileExplorerView({ repositoryId }: FileExplorerViewProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>("src/index.ts");
  const detailsQuery = useRepositoryDetails(repositoryId);
  const treeQuery = useRepositoryFileTree(repositoryId);
  const contentQuery = useRepositoryFileContent(repositoryId, selectedPath);

  const repositoryName =
    detailsQuery.data?.fullName ?? detailsQuery.data?.name ?? "Repository";

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[32rem] flex-col gap-4">
      <PageHeader
        title="Files"
        description={`Browse indexed source for ${repositoryName}.`}
        actions={
          <Button
            variant="outline"
            render={<Link href={`/repositories/${repositoryId}`} />}
          >
            <ArrowLeftIcon />
            Back to details
          </Button>
        }
      />

      <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        File tree and content are served from temporary mock data. CAP does not
        yet expose HTTP endpoints for listing files or reading file content.
      </p>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-3 py-2 text-sm font-medium">
            File tree
          </div>
          {treeQuery.isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
          ) : treeQuery.isError ? (
            <EmptyState
              icon={AlertCircleIcon}
              title="Unable to load files"
              description={getErrorMessage(treeQuery.error)}
              className="m-3 border-0 bg-transparent py-8"
            />
          ) : !treeQuery.data?.length ? (
            <EmptyState
              icon={FolderTreeIcon}
              title="No indexed files"
              description="Sync and fetch source before browsing files."
              className="m-3 border-0 bg-transparent py-8"
            />
          ) : (
            <ScrollArea className="min-h-0 flex-1">
              <FileTree
                nodes={treeQuery.data}
                selectedPath={selectedPath}
                onSelectFile={setSelectedPath}
              />
            </ScrollArea>
          )}
        </aside>

        <section className="min-h-0 min-w-0">
          {!selectedPath ? (
            <EmptyState
              icon={Code2Icon}
              title="Select a file"
              description="Choose a file from the tree to view its source."
              className="h-full"
            />
          ) : contentQuery.isLoading ? (
            <div className="h-full space-y-3 rounded-xl border border-border p-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-[70%] w-full" />
            </div>
          ) : contentQuery.isError ? (
            <EmptyState
              icon={AlertCircleIcon}
              title="Unable to load file"
              description={getErrorMessage(contentQuery.error)}
              className="h-full"
            />
          ) : !contentQuery.data ? (
            <EmptyState
              icon={Code2Icon}
              title="File unavailable"
              description="No content was returned for the selected path."
              className="h-full"
            />
          ) : (
            <CodeViewer
              path={contentQuery.data.path}
              content={contentQuery.data.content}
              language={contentQuery.data.language}
              className="h-full"
            />
          )}
        </section>
      </div>
    </div>
  );
}
