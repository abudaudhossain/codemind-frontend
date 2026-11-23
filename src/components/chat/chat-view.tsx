"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  LoaderCircleIcon,
  MessageSquareIcon,
  SendIcon,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { RelativeTime } from "@/components/shared/relative-time";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAskRepository } from "@/hooks/use-chat";
import { useRepositories } from "@/hooks/use-repositories";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { AskRepositoryResult, RepositoryViewModel } from "@/types";

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources?: AskRepositoryResult["sources"];
  model?: string;
  isError?: boolean;
}

function createTurnId() {
  return `turn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function canAskRepository(repository: RepositoryViewModel | null) {
  return repository?.status === "COMPLETED" || repository?.status === "OUTDATED";
}

export function ChatView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const repositoriesQuery = useRepositories();
  const askMutation = useAskRepository();

  const repositories = repositoriesQuery.data ?? [];
  const queryRepositoryId = searchParams.get("repositoryId");

  const [selectedId, setSelectedId] = useState<string | null>(queryRepositoryId);
  const [message, setMessage] = useState("");
  const [threads, setThreads] = useState<Record<string, ChatTurn[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeId = useMemo(() => {
    if (selectedId && repositories.some((repo) => repo.id === selectedId)) {
      return selectedId;
    }
    if (
      queryRepositoryId &&
      repositories.some((repo) => repo.id === queryRepositoryId)
    ) {
      return queryRepositoryId;
    }
    return repositories[0]?.id ?? null;
  }, [selectedId, queryRepositoryId, repositories]);

  const activeRepository =
    repositories.find((repo) => repo.id === activeId) ?? null;
  const turns = activeId ? (threads[activeId] ?? []) : [];
  const askEnabled = canAskRepository(activeRepository);

  useEffect(() => {
    if (queryRepositoryId && queryRepositoryId !== selectedId) {
      setSelectedId(queryRepositoryId);
    }
  }, [queryRepositoryId, selectedId]);

  useEffect(() => {
    if (!activeId || activeId === queryRepositoryId) return;
    router.replace(`${pathname}?repositoryId=${encodeURIComponent(activeId)}`, {
      scroll: false,
    });
  }, [activeId, pathname, queryRepositoryId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, askMutation.isPending]);

  function selectRepository(repositoryId: string) {
    setSelectedId(repositoryId);
    setSubmitError(null);
    router.replace(
      `${pathname}?repositoryId=${encodeURIComponent(repositoryId)}`,
      { scroll: false }
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content || !activeId || !askEnabled || askMutation.isPending) return;

    const askedAt = new Date().toISOString();
    const userTurn: ChatTurn = {
      id: createTurnId(),
      role: "user",
      content,
      createdAt: askedAt,
    };

    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), userTurn],
    }));
    setMessage("");
    setSubmitError(null);

    try {
      const result = await askMutation.mutateAsync({
        repositoryId: activeId,
        question: content,
      });

      const assistantTurn: ChatTurn = {
        id: createTurnId(),
        role: "assistant",
        content: result.answer,
        createdAt: new Date().toISOString(),
        sources: result.sources,
        model: result.model,
      };

      setThreads((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), assistantTurn],
      }));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setSubmitError(errorMessage);
      setThreads((prev) => ({
        ...prev,
        [activeId]: [
          ...(prev[activeId] ?? []),
          {
            id: createTurnId(),
            role: "assistant",
            content: errorMessage,
            createdAt: new Date().toISOString(),
            isError: true,
          },
        ],
      }));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chat"
        description="Ask repository-aware questions with source citations."
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Repositories</CardTitle>
            <CardDescription>Choose an indexed repository to ask about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {repositoriesQuery.isLoading ? (
              <LoaderCircleIcon className="mx-auto animate-spin text-muted-foreground" />
            ) : repositoriesQuery.isError ? (
              <p className="text-sm text-destructive">
                {getErrorMessage(repositoriesQuery.error)}
              </p>
            ) : repositories.length === 0 ? (
              <EmptyState
                icon={GitBranchIcon}
                title="No connected repositories"
                description="Connect a GitHub repository first, then return here to ask questions."
                action={{ label: "Open repositories", href: "/repositories" }}
                className="border-0 bg-transparent px-2 py-6"
              />
            ) : (
              repositories.map((repository) => {
                const isActive = repository.id === activeId;
                return (
                  <button
                    key={repository.id}
                    type="button"
                    onClick={() => selectRepository(repository.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                      isActive
                        ? "border-brand/40 bg-brand/5"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-medium">
                        {repository.fullName}
                      </p>
                      <StatusBadge status={repository.status} showIcon={false} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {repository.language}
                      {repository.lastIndexedAt ? (
                        <>
                          {" · "}
                          <RelativeTime value={repository.lastIndexedAt} />
                        </>
                      ) : null}
                    </p>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {!activeRepository ? (
          <EmptyState
            icon={MessageSquareIcon}
            title="Select a repository"
            description="Pick a connected repository from the list to start asking questions."
            className="min-h-[420px]"
          />
        ) : (
          <Card className="flex min-h-[420px] flex-col">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{activeRepository.fullName}</CardTitle>
                <StatusBadge status={activeRepository.status} />
              </div>
              <CardDescription>
                Repository-aware Q&amp;A
                {activeRepository.defaultBranch
                  ? ` · ${activeRepository.defaultBranch}`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              {!askEnabled ? (
                <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
                  <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                  <p>
                    This repository is not ready for chat yet. Finish indexing
                    from the{" "}
                    <Link
                      href={`/repositories/${activeRepository.id}`}
                      className="underline underline-offset-2"
                    >
                      repository details
                    </Link>{" "}
                    page, then try again.
                  </p>
                </div>
              ) : null}

              <ScrollArea className="min-h-[240px] flex-1 rounded-lg border border-border">
                <div className="space-y-3 p-3">
                  {turns.length === 0 ? (
                    <EmptyState
                      icon={MessageSquareIcon}
                      title="Ask a question"
                      description={`Ask anything about ${activeRepository.name}. Answers include source citations from the indexed codebase.`}
                      className="min-h-[200px] border-0 bg-transparent"
                    />
                  ) : (
                    turns.map((turn) => (
                      <div
                        key={turn.id}
                        className={cn(
                          "rounded-lg border p-3 text-sm",
                          turn.role === "user"
                            ? "ml-6 border-brand/20 bg-brand/5"
                            : turn.isError
                              ? "mr-6 border-destructive/30 bg-destructive/5"
                              : "mr-6 border-border bg-muted/20"
                        )}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            {turn.role === "user" ? "You" : "CodeMind"}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            <RelativeTime value={turn.createdAt} />
                          </span>
                        </div>
                        <p
                          className={cn(
                            "whitespace-pre-wrap",
                            turn.isError && "text-destructive"
                          )}
                        >
                          {turn.content}
                        </p>
                        {turn.model ? (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            Model: {turn.model}
                          </p>
                        ) : null}
                        {turn.sources && turn.sources.length > 0 ? (
                          <ul className="mt-3 space-y-1.5 border-t border-border pt-2">
                            {turn.sources.map((source) => (
                              <li key={`${turn.id}-${source.citationId}`}>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex max-w-full items-center gap-1.5 text-xs text-brand hover:underline"
                                >
                                  <ExternalLinkIcon className="size-3 shrink-0" />
                                  <span className="truncate">
                                    [{source.citationId}] {source.filePath}
                                    {source.startLine
                                      ? `:${source.startLine}`
                                      : ""}
                                    {source.endLine &&
                                    source.endLine !== source.startLine
                                      ? `-${source.endLine}`
                                      : ""}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))
                  )}
                  {askMutation.isPending ? (
                    <div className="mr-6 flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                      <LoaderCircleIcon className="size-4 animate-spin" />
                      Thinking…
                    </div>
                  ) : null}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={
                    askEnabled
                      ? `Ask a question about ${activeRepository.name}…`
                      : "Indexing must complete before you can ask questions"
                  }
                  disabled={!askEnabled || askMutation.isPending}
                  rows={3}
                />
                {submitError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    render={
                      <Link href={`/repositories/${activeRepository.id}/files`} />
                    }
                  >
                    Browse files
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !askEnabled || !message.trim() || askMutation.isPending
                    }
                  >
                    {askMutation.isPending ? (
                      "Sending…"
                    ) : (
                      <>
                        <SendIcon className="size-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
