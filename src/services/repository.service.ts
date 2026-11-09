import { apiClient, unwrapApiData } from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";
import type {
  ApiResponse,
  AskRepositoryResult,
  ChunkSourceResult,
  FetchSourceResult,
  GenerateEmbeddingsResult,
  GithubRepository,
  PaginatedData,
  RepositoryListQuery,
  SyncRepositoryResult,
} from "@/types";

/**
 * Verified CAP endpoints under `/github/repositories`:
 * - GET    /github/repositories
 * - PUT    /github/repositories/:id/connect
 * - PUT    /github/repositories/:id/disconnect
 * - PUT    /github/repositories/:id/sync
 * - POST   /github/repositories/:id/fetch-source
 * - POST   /github/repositories/:id/chunk-source
 * - POST   /github/repositories/:id/generate-embeddings
 * - POST   /github/repositories/:id/ask
 *
 * Missing:
 * - GET /github/repositories/:id
 * - DELETE repository
 * - GET indexing status / progress
 * - GET files / file content
 */
export const repositoryService = {
  async list(
    query: RepositoryListQuery = {}
  ): Promise<PaginatedData<GithubRepository>> {
    try {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<GithubRepository>>
      >("/github/repositories", { params: query });
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async connect(repositoryId: string): Promise<void> {
    try {
      await apiClient.put(`/github/repositories/${repositoryId}/connect`);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async disconnect(repositoryId: string): Promise<void> {
    try {
      await apiClient.put(`/github/repositories/${repositoryId}/disconnect`);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async sync(repositoryId: string): Promise<SyncRepositoryResult> {
    try {
      const response = await apiClient.put<ApiResponse<SyncRepositoryResult>>(
        `/github/repositories/${repositoryId}/sync`
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async fetchSource(repositoryId: string): Promise<FetchSourceResult> {
    try {
      const response = await apiClient.post<ApiResponse<FetchSourceResult>>(
        `/github/repositories/${repositoryId}/fetch-source`
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async chunkSource(repositoryId: string): Promise<ChunkSourceResult> {
    try {
      const response = await apiClient.post<ApiResponse<ChunkSourceResult>>(
        `/github/repositories/${repositoryId}/chunk-source`
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async generateEmbeddings(
    repositoryId: string
  ): Promise<GenerateEmbeddingsResult> {
    try {
      const response = await apiClient.post<
        ApiResponse<GenerateEmbeddingsResult>
      >(`/github/repositories/${repositoryId}/generate-embeddings`);
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  /**
   * Full re-index pipeline matching CAP README stage order:
   * sync → fetch-source → chunk-source → generate-embeddings
   */
  async reindex(repositoryId: string): Promise<{
    sync: SyncRepositoryResult;
    fetch: FetchSourceResult;
    chunk: ChunkSourceResult;
    embeddings: GenerateEmbeddingsResult;
  }> {
    const sync = await this.sync(repositoryId);
    const fetch = await this.fetchSource(repositoryId);
    const chunk = await this.chunkSource(repositoryId);
    const embeddings = await this.generateEmbeddings(repositoryId);
    return { sync, fetch, chunk, embeddings };
  },

  async ask(repositoryId: string, question: string): Promise<AskRepositoryResult> {
    try {
      const response = await apiClient.post<ApiResponse<AskRepositoryResult>>(
        `/github/repositories/${repositoryId}/ask`,
        { question }
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
