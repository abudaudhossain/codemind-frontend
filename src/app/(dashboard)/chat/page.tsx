import { Suspense } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { ChatView } from "@/components/chat/chat-view";
import { PageHeader } from "@/components/shared/page-header";

export const instant = false;

function ChatFallback() {
  return (
    <div className="flex h-[calc(100svh-8.5rem)] min-h-140 flex-col gap-4">
     
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border">
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
