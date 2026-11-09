export type RepositoryStatus = "pending" | "indexing" | "indexed" | "failed";

export type ActivityType =
  | "repository_added"
  | "indexing_completed"
  | "indexing_failed"
  | "conversation_started"
  | "search_performed";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  fileCount: number;
  status: RepositoryStatus;
  lastIndexedAt: string | null;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  repositoryId: string;
  repositoryName: string;
  messageCount: number;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalRepositories: number;
  indexedRepositories: number;
  totalIndexedFiles: number;
  totalConversations: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentRepositories: Repository[];
  recentConversations: Conversation[];
  recentActivity: ActivityItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: "layout-dashboard" | "git-branch" | "message-square" | "search" | "settings";
}
