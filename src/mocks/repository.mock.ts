/**
 * Isolated mock repository data for UI development.
 * Mirrors CAP `GithubRepository` list/connect/disconnect/sync shapes.
 * Do not import this from `services/repository.service.ts`.
 */

import type {
  GithubRepository,
  IndexingStatus,
  PaginatedData,
  RepositoryListQuery,
  RepositoryViewModel,
  SyncRepositoryResult,
} from "@/types";
import { toRepositoryViewModel } from "@/lib/repository-status";

type MockRecord = GithubRepository & {
  status: IndexingStatus;
  fileCount: number;
  chunkCount: number;
  embeddingCount: number;
  errorMessage: string | null;
};

const now = Date.now();

const mockRepositories: MockRecord[] = [
  {
    id: "repo_01",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1001",
    owner: "acme",
    name: "payments-service",
    fullName: "acme/payments-service",
    description: "Stripe-backed billing and subscription orchestration service.",
    defaultBranch: "main",
    language: "TypeScript",
    url: "https://github.com/acme/payments-service",
    isPrivate: true,
    connected: true,
    indexingStatus: "COMPLETED",
    status: "COMPLETED",
    lastSyncedAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    latestCommitSha: "a1b2c3d",
    latestTreeSha: "t1t2t3",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    fileCount: 286,
    chunkCount: 1420,
    embeddingCount: 1412,
    errorMessage: null,
  },
  {
    id: "repo_02",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1002",
    owner: "acme",
    name: "edge-gateway",
    fullName: "acme/edge-gateway",
    description: "Authenticated API gateway with rate limiting and routing.",
    defaultBranch: "main",
    language: "Go",
    url: "https://github.com/acme/edge-gateway",
    isPrivate: false,
    connected: true,
    indexingStatus: "COMPLETED",
    status: "COMPLETED",
    lastSyncedAt: new Date(now - 1000 * 60 * 60 * 30).toISOString(),
    latestCommitSha: "e4f5g6h",
    latestTreeSha: "t4t5t6",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 21).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 30).toISOString(),
    fileCount: 154,
    chunkCount: 780,
    embeddingCount: 780,
    errorMessage: null,
  },
  {
    id: "repo_03",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1003",
    owner: "acme",
    name: "design-system",
    fullName: "acme/design-system",
    description: "Shared React component library and design tokens.",
    defaultBranch: "develop",
    language: "TypeScript",
    url: "https://github.com/acme/design-system",
    isPrivate: false,
    connected: true,
    indexingStatus: "INDEXING",
    status: "INDEXING",
    lastSyncedAt: null,
    latestCommitSha: null,
    latestTreeSha: null,
    createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 10).toISOString(),
    fileCount: 412,
    chunkCount: 0,
    embeddingCount: 0,
    errorMessage: null,
  },
  {
    id: "repo_04",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1004",
    owner: "acme",
    name: "ml-pipeline",
    fullName: "acme/ml-pipeline",
    description: "Feature extraction and model evaluation workflows.",
    defaultBranch: "main",
    language: "Python",
    url: "https://github.com/acme/ml-pipeline",
    isPrivate: true,
    connected: true,
    indexingStatus: "PENDING",
    status: "PENDING",
    lastSyncedAt: null,
    latestCommitSha: null,
    latestTreeSha: null,
    createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    fileCount: 98,
    chunkCount: 0,
    embeddingCount: 0,
    errorMessage: null,
  },
  {
    id: "repo_05",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1005",
    owner: "acme",
    name: "docs-portal",
    fullName: "acme/docs-portal",
    description: "Internal documentation site with MDX content.",
    defaultBranch: "main",
    language: "MDX",
    url: "https://github.com/acme/docs-portal",
    isPrivate: false,
    connected: true,
    indexingStatus: "FAILED",
    status: "FAILED",
    lastSyncedAt: null,
    latestCommitSha: null,
    latestTreeSha: null,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    fileCount: 73,
    chunkCount: 12,
    embeddingCount: 0,
    errorMessage: "Blob fetch failed for content/getting-started.mdx",
  },
  {
    id: "repo_06",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1006",
    owner: "acme",
    name: "legacy-billing",
    fullName: "acme/legacy-billing",
    description: "Deprecated billing monolith pending migration.",
    defaultBranch: "master",
    language: "Java",
    url: "https://github.com/acme/legacy-billing",
    isPrivate: true,
    connected: true,
    indexingStatus: "OUTDATED",
    status: "OUTDATED",
    lastSyncedAt: new Date(now - 1000 * 60 * 60 * 24 * 40).toISOString(),
    latestCommitSha: "oldc0mm1t",
    latestTreeSha: "oldtree",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    fileCount: 640,
    chunkCount: 2100,
    embeddingCount: 2100,
    errorMessage: null,
  },
  // Accessible via GitHub App but not yet connected to CodeMind
  {
    id: "repo_07",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1007",
    owner: "acme",
    name: "observability",
    fullName: "acme/observability",
    description: "Shared OpenTelemetry collectors and dashboards.",
    defaultBranch: "main",
    language: "TypeScript",
    url: "https://github.com/acme/observability",
    isPrivate: false,
    connected: false,
    indexingStatus: "PENDING",
    status: "PENDING",
    lastSyncedAt: null,
    latestCommitSha: null,
    latestTreeSha: null,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    fileCount: 0,
    chunkCount: 0,
    embeddingCount: 0,
    errorMessage: null,
  },
  {
    id: "repo_08",
    userId: 1,
    installationId: "1094070",
    githubRepositoryId: "1008",
    owner: "acme",
    name: "mobile-app",
    fullName: "acme/mobile-app",
    description: "React Native client for customer accounts.",
    defaultBranch: "main",
    language: "TypeScript",
    url: "https://github.com/acme/mobile-app",
    isPrivate: true,
    connected: false,
    indexingStatus: "PENDING",
    status: "PENDING",
    lastSyncedAt: null,
    latestCommitSha: null,
    latestTreeSha: null,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
    fileCount: 0,
    chunkCount: 0,
    embeddingCount: 0,
    errorMessage: null,
  },
];

function toGithub(record: MockRecord): GithubRepository {
  const {
    status: _status,
    fileCount: _fileCount,
    chunkCount: _chunkCount,
    embeddingCount: _embeddingCount,
    errorMessage: _errorMessage,
    ...repo
  } = record;
  void _status;
  void _fileCount;
  void _chunkCount;
  void _embeddingCount;
  void _errorMessage;
  return repo;
}

function toView(record: MockRecord): RepositoryViewModel {
  return toRepositoryViewModel(toGithub(record), {
    status: record.status,
    fileCount: record.fileCount,
    chunkCount: record.chunkCount,
    embeddingCount: record.embeddingCount,
    errorMessage: record.errorMessage,
  });
}

export const repositoryMock = {
  async list(
    query: RepositoryListQuery = {}
  ): Promise<PaginatedData<GithubRepository>> {
    await delay(350);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim().toLowerCase() ?? "";

    let items = mockRepositories.filter((repo) => {
      if (typeof query.connected === "boolean" && repo.connected !== query.connected) {
        return false;
      }
      if (search) {
        const haystack = `${repo.name} ${repo.fullName} ${repo.owner}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });

    const total = items.length;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items: items.map(toGithub),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  },

  async listViewModels(connected = true): Promise<RepositoryViewModel[]> {
    await delay(350);
    return mockRepositories
      .filter((repo) => repo.connected === connected)
      .map(toView);
  },

  async getById(repositoryId: string): Promise<RepositoryViewModel | null> {
    await delay(250);
    const record = mockRepositories.find((repo) => repo.id === repositoryId);
    return record ? toView(record) : null;
  },

  async connect(repositoryId: string): Promise<void> {
    await delay(400);
    const record = mockRepositories.find((repo) => repo.id === repositoryId);
    if (!record) throw new Error("Repository not found");
    if (record.connected) throw new Error("Repository already imported");
    record.connected = true;
    record.status = "PENDING";
    record.indexingStatus = "PENDING";
    record.updatedAt = new Date().toISOString();
  },

  async disconnect(repositoryId: string): Promise<void> {
    await delay(400);
    const record = mockRepositories.find((repo) => repo.id === repositoryId);
    if (!record) throw new Error("Repository not found");
    record.connected = false;
    record.updatedAt = new Date().toISOString();
  },

  async reindex(repositoryId: string): Promise<SyncRepositoryResult> {
    await delay(600);
    const record = mockRepositories.find((repo) => repo.id === repositoryId);
    if (!record) throw new Error("Repository not found");
    if (!record.connected) throw new Error("Connect the repository before syncing");

    record.status = "INDEXING";
    record.indexingStatus = "INDEXING";
    record.errorMessage = null;
    record.updatedAt = new Date().toISOString();

    await delay(800);

    record.status = "COMPLETED";
    record.indexingStatus = "COMPLETED";
    record.lastSyncedAt = new Date().toISOString();
    record.latestCommitSha = "reidx01";
    record.latestTreeSha = "retree1";
    record.updatedAt = new Date().toISOString();

    return {
      syncId: `sync_${repositoryId}`,
      status: "COMPLETED",
      commitSha: record.latestCommitSha,
      treeSha: record.latestTreeSha,
      summary: {
        totalFiles: record.fileCount,
        addedFiles: 2,
        changedFiles: 5,
        unchangedFiles: Math.max(record.fileCount - 7, 0),
        deletedFiles: 0,
      },
    };
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
