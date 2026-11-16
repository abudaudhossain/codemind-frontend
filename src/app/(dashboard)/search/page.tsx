 "use client";

import { SearchIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRepositorySearch } from "@/hooks/use-search";
import { getErrorMessage } from "@/lib/api-error";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const searchMutation = useRepositorySearch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) void searchMutation.mutateAsync({ query: value });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Semantic Search"
        description="Search across indexed repositories using natural language."
      />

      <Card>
        <CardContent className="pt-(--card-spacing)">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Describe the code you’re looking for…"
              className="h-10 pl-9"
              aria-label="Semantic search query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button className="h-10 shrink-0" type="submit" disabled={!query.trim() || searchMutation.isPending}>
            {searchMutation.isPending ? "Searching…" : "Search"}
          </Button>
          </form>
        </CardContent>
      </Card>

      {searchMutation.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getErrorMessage(searchMutation.error)}
        </p>
      ) : searchMutation.data?.length ? (
        <div className="space-y-3">
          {searchMutation.data.map((result, index) => (
            <Card key={result.citationId ?? `${result.filePath}-${index}`}>
              <CardContent className="space-y-2 pt-(--card-spacing)">
                <p className="font-medium">{result.filePath}</p>
                {result.content ? (
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {result.content}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {result.startLine !== undefined
                    ? `Lines ${result.startLine}-${result.endLine ?? result.startLine}`
                    : "Indexed result"}
                  {result.similarity !== undefined
                    ? ` · ${(result.similarity * 100).toFixed(1)}% match`
                    : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchIcon}
          title="No search results yet"
          description="Enter a natural-language query to search indexed repositories."
          className="min-h-[320px]"
        />
      )}
    </div>
  );
}
