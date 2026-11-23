"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INDEXING_STATUS_FILTER_OPTIONS } from "@/hooks/use-repositories";
import { INDEXING_STATUS_LABELS } from "@/lib/repository-status";
import type { RepositoryListFilters } from "@/types";
import { cn } from "@/lib/utils";

interface RepositoryFiltersProps {
  filters: RepositoryListFilters;
  languages: string[];
  resultCount: number;
  totalCount: number;
  onChange: (next: RepositoryListFilters) => void;
  onReset: () => void;
  className?: string;
}

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function RepositoryFilters({
  filters,
  languages,
  resultCount,
  totalCount,
  onChange,
  onReset,
  className,
}: RepositoryFiltersProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.language !== "all" ||
    filters.sort !== "recently-added";

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Search by name, owner, or full path"
            className="pl-8"
            aria-label="Search repositories"
          />
          {filters.search ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
              aria-label="Clear search"
              onClick={() => onChange({ ...filters, search: "" })}
            >
              <XIcon />
            </Button>
          ) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[min(100%,28rem)]">
          <label className="sr-only" htmlFor="repo-status-filter">
            Filter by indexing status
          </label>
          <select
            id="repo-status-filter"
            className={selectClassName}
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as RepositoryListFilters["status"],
              })
            }
          >
            {INDEXING_STATUS_FILTER_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All statuses"
                  : INDEXING_STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="repo-language-filter">
            Filter by language
          </label>
          <select
            id="repo-language-filter"
            className={selectClassName}
            value={filters.language}
            onChange={(event) =>
              onChange({ ...filters, language: event.target.value })
            }
          >
            <option value="all">All languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="repo-sort">
            Sort repositories
          </label>
          <select
            id="repo-sort"
            className={selectClassName}
            value={filters.sort}
            onChange={(event) =>
              onChange({
                ...filters,
                sort: event.target.value as RepositoryListFilters["sort"],
              })
            }
          >
            <option value="recently-added">Recently added</option>
            <option value="recently-updated">Recently updated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {hasActiveFilters ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">{resultCount}</span>{" "}
              of {totalCount}{" "}
              {totalCount === 1 ? "repository" : "repositories"}
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              {totalCount === 1 ? "repository" : "repositories"}
            </>
          )}
        </p>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-muted-foreground"
            onClick={onReset}
          >
            <XIcon />
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
