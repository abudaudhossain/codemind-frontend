"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircleIcon,
  FolderTreeIcon,
  GitBranchIcon,
  LoaderCircleIcon,
  MessageSquareIcon,
  PlusIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ConversationListItem } from "@/components/chat/conversation-list-item";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  useConversation,
  useConversations,
  useCreateConversation,
  useSendConversationMessage,
} from "@/hooks/use-conversations";
import { useRepositories } from "@/hooks/use-repositories";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { ConversationMessage, RepositoryViewModel } from "@/types";

const SUGGESTED_PROMPTS = [
  "Where is authentication handled?",
  "Explain the main data models",
  "How are API routes structured?",
];

function canAskRepository(repository: RepositoryViewModel | null | undefined) {
  return repository?.status === "COMPLETED" || repository?.status === "OUTDATED";
}

function conversationHref(conversationId: string) {
  return `/chat?conversationId=${encodeURIComponent(conversationId)}`;
}

export function ChatView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationsQuery = useConversations();
  const repositoriesQuery = useRepositories();
  const createConversation = useCreateConversation();

  const conversations = conversationsQuery.data ?? [];
  const repositories = repositoriesQuery.data ?? [];

  const queryConversationId = searchParams.get("conversationId");
  const queryRepositoryId = searchParams.get("repositoryId");

  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [pendingRepoId, setPendingRepoId] = useState<string | null>(null);
  const [deepLinkHandled, setDeepLinkHandled] = useState(false);
  const deepLinkInFlight = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const activeId = useMemo(() => {
    if (
      queryConversationId &&
      conversations.some((conversation) => conversation.id === queryConversationId)
    ) {
      return queryConversationId;
    }
    return null;
  }, [queryConversationId, conversations]);

  const conversationQuery = useConversation(activeId);
  const sendMessage = useSendConversationMessage(activeId);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? null;
  const activeRepository =
    repositories.find((repo) => repo.id === activeConversation?.repositoryId) ??
    null;
  const messages: ConversationMessage[] =
    conversationQuery.data?.messages ?? [];
  const askEnabled = canAskRepository(activeRepository);
  const chatReadyRepos = repositories.filter((repo) =>
    canAskRepository(repo)
  );
  const canSend =
    Boolean(askEnabled && message.trim() && activeId && !sendMessage.isPending);

  useEffect(() => {
    if (queryConversationId || queryRepositoryId) return;
    if (conversationsQuery.isLoading) return;
    const firstId = conversations[0]?.id;
    if (!firstId) return;
    router.replace(conversationHref(firstId), { scroll: false });
  }, [
    queryConversationId,
    queryRepositoryId,
    conversationsQuery.isLoading,
    conversations,
    router,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sendMessage.isPending]);

  useEffect(() => {
    if (deepLinkHandled || deepLinkInFlight.current || queryConversationId) {
      return;
    }
    if (!queryRepositoryId) {
      setDeepLinkHandled(true);
      return;
    }
    if (conversationsQuery.isLoading || repositoriesQuery.isLoading) return;

    const existing = conversations.find(
      (conversation) => conversation.repositoryId === queryRepositoryId
    );
    if (existing) {
      router.replace(conversationHref(existing.id), { scroll: false });
      setDeepLinkHandled(true);
      return;
    }

    const repo = repositories.find((item) => item.id === queryRepositoryId);
    if (!repo || !canAskRepository(repo)) {
      setDeepLinkHandled(true);
      return;
    }

    deepLinkInFlight.current = true;
    void createConversation
      .mutateAsync({ repositoryId: queryRepositoryId })
      .then((created) => {
        router.replace(conversationHref(created.id), { scroll: false });
      })
      .catch(() => {
        /* leave user on chat with empty selection */
      })
      .finally(() => {
        deepLinkInFlight.current = false;
        setDeepLinkHandled(true);
      });
  }, [
    deepLinkHandled,
    queryConversationId,
    queryRepositoryId,
    conversationsQuery.isLoading,
    repositoriesQuery.isLoading,
    createConversation,
    conversations,
    repositories,
    router,
  ]);

  async function handleCreateConversation(repositoryId: string) {
    setPendingRepoId(repositoryId);
    setSubmitError(null);
    try {
      const created = await createConversation.mutateAsync({ repositoryId });
      setNewChatOpen(false);
      router.replace(conversationHref(created.id), { scroll: false });
      requestAnimationFrame(() => composerRef.current?.focus());
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setPendingRepoId(null);
    }
  }

  async function submitMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || !activeId || !askEnabled || sendMessage.isPending) return;

    setMessage("");
    setSubmitError(null);

    try {
      await sendMessage.mutateAsync(trimmed);
      requestAnimationFrame(() => composerRef.current?.focus());
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setMessage(trimmed);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitMessage(message);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(message);
    }
  }

  return (
    <div className="flex h-[calc(100svh-8.5rem)] min-h-140 flex-col gap-4">
     

      <div className="grid min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="flex min-h-0 flex-col border-b border-border lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">History</p>
              <p className="text-xs text-muted-foreground">
                {conversations.length} conversation
                {conversations.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setNewChatOpen(true)}
              disabled={chatReadyRepos.length === 0}
              aria-label="Start new chat"
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-0.5 p-2">
              {conversationsQuery.isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : conversationsQuery.isError ? (
                <p className="px-2 py-4 text-sm text-destructive">
                  {getErrorMessage(conversationsQuery.error)}
                </p>
              ) : conversations.length === 0 ? (
                <EmptyState
                  icon={MessageSquareIcon}
                  title="No chats yet"
                  description="Start a conversation with an indexed repository."
                  action={
                    chatReadyRepos.length > 0
                      ? {
                          label: "New chat",
                          onClick: () => setNewChatOpen(true),
                        }
                      : {
                          label: "Open repositories",
                          href: "/repositories",
                        }
                  }
                  className="border-0 bg-transparent px-2 py-8"
                />
              ) : (
                conversations.map((conversation) => (
                  <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    active={conversation.id === activeId}
                    href={conversationHref(conversation.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Main transcript */}
        {!activeConversation ? (
          <div className="flex min-h-0 flex-col items-center justify-center p-6">
            <EmptyState
              icon={SparklesIcon}
              title="Start a conversation"
              description="Choose a chat from history, or open a new one against an indexed repository."
              action={
                chatReadyRepos.length > 0
                  ? {
                      label: "New chat",
                      onClick: () => setNewChatOpen(true),
                    }
                  : {
                      label: "Connect a repository",
                      href: "/repositories",
                    }
              }
              className="border-0 bg-transparent"
            />
          </div>
        ) : (
          <section className="flex min-h-0 flex-col">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-sm font-semibold">
                    {activeConversation.title}
                  </h2>
                  {activeRepository ? (
                    <StatusBadge status={activeRepository.status} showIcon={false} />
                  ) : null}
                </div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <GitBranchIcon className="size-3" aria-hidden />
                    {activeConversation.repositoryName}
                  </span>
                  {activeRepository?.defaultBranch ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>{activeRepository.defaultBranch}</span>
                    </>
                  ) : null}
                </p>
              </div>
              {activeRepository ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  render={
                    <Link href={`/repositories/${activeRepository.id}/files`} />
                  }
                >
                  <FolderTreeIcon className="size-3.5" />
                  Browse files
                </Button>
              ) : null}
            </header>

            {activeRepository && !askEnabled ? (
              <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                <p>
                  This repository is not ready for chat yet. Finish indexing from{" "}
                  <Link
                    href={`/repositories/${activeRepository.id}`}
                    className="font-medium underline underline-offset-2"
                  >
                    repository details
                  </Link>
                  , then try again.
                </p>
              </div>
            ) : null}

            <ScrollArea className="min-h-0 flex-1">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-5">
                {conversationQuery.isLoading ? (
                  <div className="flex min-h-50 items-center justify-center">
                    <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : conversationQuery.isError ? (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(conversationQuery.error)}
                  </p>
                ) : messages.length === 0 ? (
                  <div className="flex min-h-50 flex-col items-center justify-center gap-5 text-center">
                    <div className="space-y-2">
                      <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground">
                        <SparklesIcon className="size-5" aria-hidden />
                      </div>
                      <h3 className="text-base font-medium">
                        Ask about {activeConversation.repositoryName}
                      </h3>
                      <p className="max-w-md text-sm text-muted-foreground">
                        CodeMind answers from your indexed codebase and cites the
                        files it used.
                      </p>
                    </div>
                    {askEnabled ? (
                      <div className="flex w-full max-w-lg flex-col gap-2">
                        {SUGGESTED_PROMPTS.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => void submitMessage(prompt)}
                            disabled={sendMessage.isPending}
                            className={cn(
                              "rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors",
                              "hover:border-brand/30 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            )}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  messages.map((turn) => (
                    <ChatMessage key={turn.id} message={turn} />
                  ))
                )}

                {sendMessage.isPending ? (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground animate-in fade-in-0 duration-200">
                    <span className="flex size-8 items-center justify-center rounded-full border border-border bg-muted">
                      <LoaderCircleIcon className="size-3.5 animate-spin" />
                    </span>
                    <span>CodeMind is thinking…</span>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-card/80 p-3 backdrop-blur-sm md:p-4">
              <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-3xl space-y-2"
              >
                <div className="rounded-xl border border-border bg-background shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
                  <Textarea
                    ref={composerRef}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder={
                      askEnabled
                        ? `Ask anything about ${activeConversation.repositoryName}…`
                        : "Indexing must finish before you can ask questions"
                    }
                    disabled={!askEnabled || sendMessage.isPending}
                    rows={2}
                    className="min-h-14 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />
                  <div className="flex items-center justify-between gap-2 border-t border-border/70 px-2.5 py-2">
                    <p className="hidden text-[11px] text-muted-foreground sm:block">
                      Enter to send · Shift+Enter for a new line
                    </p>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!canSend}
                      className="ml-auto"
                    >
                      {sendMessage.isPending ? (
                        <>
                          <LoaderCircleIcon className="size-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          <SendIcon className="size-4" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {submitError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {submitError}
                  </p>
                ) : null}
              </form>
            </div>
          </section>
        )}
      </div>

      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New chat</DialogTitle>
            <DialogDescription>
              Pick an indexed repository to start a fresh conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-1.5 overflow-y-auto">
            {repositoriesQuery.isLoading ? (
              <div className="flex justify-center py-8">
                <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : chatReadyRepos.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No indexed repositories yet. Connect and index one first.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  render={<Link href="/repositories" />}
                >
                  Open repositories
                </Button>
              </div>
            ) : (
              chatReadyRepos.map((repository) => (
                <button
                  key={repository.id}
                  type="button"
                  onClick={() => void handleCreateConversation(repository.id)}
                  disabled={createConversation.isPending}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:border-brand/30 hover:bg-brand/5 disabled:opacity-60"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {repository.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {repository.language}
                      {repository.defaultBranch
                        ? ` · ${repository.defaultBranch}`
                        : ""}
                    </span>
                  </span>
                  {pendingRepoId === repository.id ? (
                    <LoaderCircleIcon className="size-4 shrink-0 animate-spin text-muted-foreground" />
                  ) : (
                    <StatusBadge status={repository.status} showIcon={false} />
                  )}
                </button>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewChatOpen(false)}
              disabled={createConversation.isPending}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
