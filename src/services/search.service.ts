import { apiClient, unwrapApiData } from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";
import type { ApiResponse, SearchResult } from "@/types";

export const searchService = {
  async search(
    query: string,
    repositoryId?: string,
    topK = 5
  ): Promise<SearchResult[]> {
    try {
      const response = await apiClient.get<ApiResponse<SearchResult[]>>(
        "/vector-search/search",
        { params: { query, repositoryId, topK } }
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
