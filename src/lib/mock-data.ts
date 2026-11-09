import type {
  ActivityItem,
  Conversation,
  DashboardData,
  Repository,
  UserProfile,
} from "@/types";

export const mockUser: UserProfile = {
  id: "user_01",
  name: "Alex Rivera",
  email: "alex@codemind.ai",
  initials: "AR",
};

export const mockRepositories: Repository[] = [
  {
    id: "repo_01",
    name: "payments-service",
    fullName: "acme/payments-service",
    description: "Stripe-backed billing and subscription orchestration service.",
    language: "TypeScript",
    stars: 412,
    fileCount: 286,
    status: "indexed",
    lastIndexedAt: "2026-11-08T18:24:00.000Z",
    updatedAt: "2026-11-08T18:24:00.000Z",
  },
  {
    id: "repo_02",
    name: "edge-gateway",
    fullName: "acme/edge-gateway",
    description: "Authenticated API gateway with rate limiting and routing.",
    language: "Go",
    stars: 891,
    fileCount: 154,
    status: "indexed",
    lastIndexedAt: "2026-11-08T14:02:00.000Z",
    updatedAt: "2026-11-08T14:02:00.000Z",
  },
  {
    id: "repo_03",
    name: "design-system",
    fullName: "acme/design-system",
    description: "Shared React component library and design tokens.",
    language: "TypeScript",
    stars: 230,
    fileCount: 412,
    status: "indexing",
    lastIndexedAt: null,
    updatedAt: "2026-11-09T07:10:00.000Z",
  },
  {
    id: "repo_04",
    name: "ml-pipeline",
    fullName: "acme/ml-pipeline",
    description: "Feature extraction and model evaluation workflows.",
    language: "Python",
    stars: 167,
    fileCount: 98,
    status: "pending",
    lastIndexedAt: null,
    updatedAt: "2026-11-07T21:40:00.000Z",
  },
  {
    id: "repo_05",
    name: "docs-portal",
    fullName: "acme/docs-portal",
    description: "Internal documentation site with MDX content.",
    language: "MDX",
    stars: 54,
    fileCount: 73,
    status: "failed",
    lastIndexedAt: null,
    updatedAt: "2026-11-06T11:15:00.000Z",
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv_01",
    title: "How does webhook retry logic work?",
    repositoryId: "repo_01",
    repositoryName: "acme/payments-service",
    messageCount: 12,
    updatedAt: "2026-11-09T06:45:00.000Z",
  },
  {
    id: "conv_02",
    title: "Explain auth middleware chain",
    repositoryId: "repo_02",
    repositoryName: "acme/edge-gateway",
    messageCount: 8,
    updatedAt: "2026-11-08T22:18:00.000Z",
  },
  {
    id: "conv_03",
    title: "Where are token refresh tokens stored?",
    repositoryId: "repo_02",
    repositoryName: "acme/edge-gateway",
    messageCount: 5,
    updatedAt: "2026-11-08T16:03:00.000Z",
  },
  {
    id: "conv_04",
    title: "Map invoice status transitions",
    repositoryId: "repo_01",
    repositoryName: "acme/payments-service",
    messageCount: 15,
    updatedAt: "2026-11-07T19:27:00.000Z",
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: "act_01",
    type: "indexing_completed",
    title: "Indexing completed",
    description: "acme/payments-service finished indexing 286 files.",
    timestamp: "2026-11-08T18:24:00.000Z",
  },
  {
    id: "act_02",
    type: "conversation_started",
    title: "New conversation",
    description: "Started chat about webhook retry logic.",
    timestamp: "2026-11-09T06:40:00.000Z",
  },
  {
    id: "act_03",
    type: "repository_added",
    title: "Repository added",
    description: "acme/design-system was connected to CodeMind.",
    timestamp: "2026-11-09T07:08:00.000Z",
  },
  {
    id: "act_04",
    type: "search_performed",
    title: "Semantic search",
    description: "Queried “rate limit burst window” across indexed repos.",
    timestamp: "2026-11-08T15:51:00.000Z",
  },
  {
    id: "act_05",
    type: "indexing_failed",
    title: "Indexing failed",
    description: "acme/docs-portal failed during file ingestion.",
    timestamp: "2026-11-06T11:15:00.000Z",
  },
];

export const mockDashboardData: DashboardData = {
  stats: {
    totalRepositories: mockRepositories.length,
    indexedRepositories: mockRepositories.filter((repo) => repo.status === "indexed")
      .length,
    totalIndexedFiles: mockRepositories
      .filter((repo) => repo.status === "indexed")
      .reduce((sum, repo) => sum + repo.fileCount, 0),
    totalConversations: mockConversations.length,
  },
  recentRepositories: mockRepositories.slice(0, 4),
  recentConversations: mockConversations.slice(0, 4),
  recentActivity: mockActivity,
};
