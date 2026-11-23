/** Shared NestJS response envelope from CAP ResponseInterceptor. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ConversationMessageSource {
  citationId: string;
  filePath: string;
  startLine: number;
  endLine: number;
  similarity: number;
  url: string;
}

export interface ConversationMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  model?: string;
  sources?: ConversationMessageSource[];
  createdAt: string;
}

export interface ConversationDetails {
  id: string;
  title: string;
  repositoryId: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SendConversationMessageResult {
  userMessage: ConversationMessage;
  assistantMessage: ConversationMessage;
}

export interface SearchResult {
  citationId?: string;
  filePath: string;
  startLine?: number;
  endLine?: number;
  similarity?: number;
  content?: string;
  url?: string;
}
