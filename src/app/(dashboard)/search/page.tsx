import type { Metadata } from "next";
import { SearchIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Semantic Search",
};

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Semantic Search"
        description="Search across indexed repositories using natural language. Query execution will connect to pgvector via NestJS later."
      />

      <Card>
        <CardContent className="flex flex-col gap-3 pt-(--card-spacing) sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Describe the code you’re looking for…"
              className="h-10 pl-9"
              aria-label="Semantic search query"
            />
          </div>
          <Button className="h-10 shrink-0" disabled>
            Search
          </Button>
        </CardContent>
      </Card>

      <EmptyState
        icon={SearchIcon}
        title="No search results yet"
        description="Semantic search is scaffolded and ready for NestJS + pgvector integration. Results and code snippets will appear here."
        className="min-h-[320px]"
      />
    </div>
  );
}
