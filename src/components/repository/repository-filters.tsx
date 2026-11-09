"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { INDEXING_STATUS_FILTER_OPTIONS } from "@/hooks/use-repositories";
import { INDEXING_STATUS_LABELS } from "@/lib/repository-status";
import type { RepositoryListFilters } from "@/types";
import { cn } from "@/lib/utils";

interface RepositoryFiltersProps {
  filters: RepositoryListFilters;
  languages: string[];
  onChange: (next: RepositoryListFilters) => void;
  className?: string;
}

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function RepositoryFilters({
  filters,
  languages,
  onChange,
  className,
}: RepositoryFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-3 lg:flex-row lg:items-center",
        className
      )}
    >
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
          placeholder="Search by repository name"
          className="pl-8"
          aria-label="Search repositories"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-3 lg:w-auto lg:grid-cols-3">
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
              {status === "all" ? "All statuses" : INDEXING_STATUS_LABELS[status]}
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
  );
}
