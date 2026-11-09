export type {
  ActivityType,
  Conversation,
  ActivityItem,
  DashboardStats,
  DashboardData,
  DashboardRepository,
  NavItem,
  UserProfile,
} from "./legacy";

export type {
  IndexingStatus,
  RepositoryStatus,
  GithubRepository,
  RepositoryListQuery,
  RepositoryListFilters,
  RepositoryStatsSummary,
  SyncRepositoryResult,
  FetchSourceResult,
  ChunkSourceResult,
  GenerateEmbeddingsResult,
  AskRepositoryResult,
  GithubInstallResult,
  RepositoryViewModel,
  FileTreeNode,
  RepositoryFileContent,
  GithubConnectionState,
} from "./repository";

export type { ApiResponse, PaginationMeta, PaginatedData } from "./api";

/** Alias for Phase 1 dashboard components. */
export type { DashboardRepository as Repository } from "./legacy";
