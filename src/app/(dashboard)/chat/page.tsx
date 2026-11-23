"use client";

import { Suspense } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { ChatView } from "@/components/chat/chat-view";
import { PageHeader } from "@/components/shared/page-header";

function ChatFallback() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chat"
        description="Ask repository-aware questions with source citations."
      />
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-border">
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatFallback />}>
      <ChatView />
    </Suspense>
  );
}
