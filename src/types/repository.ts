/**
 * Types aligned with CAP Prisma `GithubRepository` and sync pipeline.
 * Indexing status values mirror backend `GithubSyncStatus` plus unused
 * repo-level `indexingStatus` string and UI-only OUTDATED.
 */

export type IndexingStatus =
  | "PENDING"
  | "INDEXING"
  | "COMPLETED"
  | "FAILED"
  | "OUTDATED";

/** @deprecated Prefer IndexingStatus — kept for dashboard mock compatibility. */
export type RepositoryStatus = "pending" | "indexing" | "indexed" | "failed";

export interface GithubRepository {
  id: string;
  userId: number;
  installationId: string;
  githubRepositoryId: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string | null;
  language: string | null;
  url: string;
  isPrivate: boolean;
  connected: boolean;
  /** Present on model; not updated by CAP services today. */
  indexingStatus: string;
  lastSyncedAt: string | null;
  latestCommitSha: string | null;
  latestTreeSha: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  connected?: boolean;
}

export interface RepositoryListFilters {
  search: string;
  status: IndexingStatus | "all";
  language: string | "all";
  sort: "recently-added" | "recently-updated";
}

export interface RepositoryStatsSummary {
  total: number;
  completed: number;
  indexing: number;
  failed: number;
  pending: number;
  outdated: number;
}

export interface SyncRepositoryResult {
  syncId: string;
  status: "COMPLETED";
  commitSha: string;
  treeSha: string;
  summary: {
    totalFiles: number;
    addedFiles: number;
    changedFiles: number;
    unchangedFiles: number;
    deletedFiles: number;
  };
}

export interface FetchSourceResult {
  repositoryId: string;
  totalCandidates: number;
  attempted: number;
  fetched: number;
  skipped: number;
  failed: number;
  remaining: number;
}

export interface ChunkSourceResult {
  repositoryId: string;
  totalCandidates: number;
  indexed: number;
  unchanged: number;
  skipped: number;
  failed: number;
}

export interface GenerateEmbeddingsResult {
  repositoryId: string;
  processed: number;
  skipped: number;
  failed: number;
  batches: number;
}

export interface AskRepositoryResult {
  answer: string;
  model: string;
  sources: Array<{
    citationId: string;
    filePath: string;
    startLine: number;
    endLine: number;
    similarity: number;
    url: string;
  }>;
}

export interface GithubInstallResult {
  message: string;
  installationId: string;
}

/**
 * UI-facing repository view model. Derived from GithubRepository plus
 * normalized indexing status. Metrics beyond CAP list payload are optional
 * and only filled when a verified source provides them (or mocks).
 */
export interface RepositoryViewModel {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  description: string;
  language: string;
  defaultBranch: string;
  isPrivate: boolean;
  url: string;
  connected: boolean;
  status: IndexingStatus;
  lastIndexedAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestCommitSha: string | null;
  errorMessage?: string | null;
  /** Only when backend/mock provides file counts. */
  fileCount?: number;
  chunkCount?: number;
  embeddingCount?: number;
}

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  language?: string | null;
  size?: number;
  isIndexed?: boolean;
  updatedAt?: string;
  children?: FileTreeNode[];
}

export interface RepositoryFileContent {
  path: string;
  language: string | null;
  content: string;
  size: number;
  isIndexed: boolean;
  updatedAt?: string;
}

export interface GithubConnectionState {
  connected: boolean;
  accountLogin: string | null;
  accountId: string | null;
  targetType: string | null;
  repositorySelection: string | null;
  installationId: string | null;
}
