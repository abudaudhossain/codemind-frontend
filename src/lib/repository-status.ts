import type {
  GithubRepository,
  IndexingStatus,
  RepositoryStatsSummary,
  RepositoryViewModel,
} from "@/types";

const KNOWN_STATUSES: IndexingStatus[] = [
  "PENDING",
  "INDEXING",
  "COMPLETED",
  "FAILED",
  "OUTDATED",
];

export const INDEXING_STATUS_LABELS: Record<IndexingStatus, string> = {
  PENDING: "Pending",
  INDEXING: "Indexing",
  COMPLETED: "Completed",
  FAILED: "Failed",
  OUTDATED: "Outdated",
};

export const INDEXING_STATUS_DESCRIPTIONS: Record<IndexingStatus, string> = {
  PENDING: "Waiting to start.",
  INDEXING: "Currently processing.",
  COMPLETED: "Successfully indexed.",
  FAILED: "Indexing failed.",
  OUTDATED: "Repository needs re-indexing.",
};

export function normalizeIndexingStatus(value: string | null | undefined): IndexingStatus {
  if (!value) return "PENDING";
  const upper = value.toUpperCase();
  if (KNOWN_STATUSES.includes(upper as IndexingStatus)) {
    return upper as IndexingStatus;
  }
  // Legacy Phase 1 mock values
  if (value === "indexed") return "COMPLETED";
  if (value === "pending") return "PENDING";
  if (value === "indexing") return "INDEXING";
  if (value === "failed") return "FAILED";
  return "PENDING";
}

export function toRepositoryViewModel(
  repository: GithubRepository,
  extras?: Partial<
    Pick<
      RepositoryViewModel,
      "fileCount" | "chunkCount" | "embeddingCount" | "errorMessage" | "status"
    >
  >
): RepositoryViewModel {
  return {
    id: repository.id,
    name: repository.name,
    owner: repository.owner,
    fullName: repository.fullName,
    description: repository.description ?? "",
    language: repository.language ?? "Unknown",
    defaultBranch: repository.defaultBranch ?? "main",
    isPrivate: repository.isPrivate,
    url: repository.url,
    connected: repository.connected,
    status: extras?.status ?? normalizeIndexingStatus(repository.indexingStatus),
    lastIndexedAt: repository.lastSyncedAt,
    createdAt: repository.createdAt,
    updatedAt: repository.updatedAt,
    latestCommitSha: repository.latestCommitSha,
    errorMessage: extras?.errorMessage ?? null,
    fileCount: extras?.fileCount,
    chunkCount: extras?.chunkCount,
    embeddingCount: extras?.embeddingCount,
  };
}

export function computeRepositoryStats(
  repositories: RepositoryViewModel[]
): RepositoryStatsSummary {
  return repositories.reduce<RepositoryStatsSummary>(
    (acc, repo) => {
      acc.total += 1;
      switch (repo.status) {
        case "COMPLETED":
          acc.completed += 1;
          break;
        case "INDEXING":
          acc.indexing += 1;
          break;
        case "FAILED":
          acc.failed += 1;
          break;
        case "OUTDATED":
          acc.outdated += 1;
          break;
        default:
          acc.pending += 1;
      }
      return acc;
    },
    {
      total: 0,
      completed: 0,
      indexing: 0,
      failed: 0,
      pending: 0,
      outdated: 0,
    }
  );
}

export function filterAndSortRepositories(
  repositories: RepositoryViewModel[],
  filters: {
    search: string;
    status: IndexingStatus | "all";
    language: string | "all";
    sort: "recently-added" | "recently-updated";
  }
): RepositoryViewModel[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = repositories.filter((repo) => {
    if (query) {
      const haystack = `${repo.name} ${repo.fullName} ${repo.owner}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.status !== "all" && repo.status !== filters.status) return false;
    if (filters.language !== "all" && repo.language !== filters.language) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    const left =
      filters.sort === "recently-added"
        ? new Date(a.createdAt).getTime()
        : new Date(a.updatedAt).getTime();
    const right =
      filters.sort === "recently-added"
        ? new Date(b.createdAt).getTime()
        : new Date(b.updatedAt).getTime();
    return right - left;
  });
}
