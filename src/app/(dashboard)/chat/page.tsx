import type { Metadata } from "next";
import { MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelativeTime } from "@/components/shared/relative-time";
import { mockConversations } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Chat",
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chat"
        description="Ask repository-aware questions with source citations. Chat runtime will connect to NestJS and Gemini in a later phase."
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Recent threads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <p className="line-clamp-1 text-sm font-medium">{conversation.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {conversation.repositoryName} ·{" "}
                  <RelativeTime value={conversation.updatedAt} />
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <EmptyState
          icon={MessageSquareIcon}
          title="Chat workspace ready"
          description="The conversation UI shell is in place. Streaming responses, citations, and repository context will be wired to the NestJS API next."
          className="min-h-[420px]"
        />
      </div>
    </div>
  );
}
