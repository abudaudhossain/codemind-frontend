import { apiClient, unwrapApiData } from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";
import type {
  ApiResponse,
  ConversationDetails,
  Conversation,
  ConversationMessage,
} from "@/types";

export const conversationService = {
  async list(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get<ApiResponse<Conversation[]>>(
        "/conversations"
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async create(repositoryId: string, title: string): Promise<Conversation> {
    try {
      const response = await apiClient.post<ApiResponse<Conversation>>(
        "/conversations",
        { repositoryId, title }
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async details(id: string): Promise<ConversationDetails> {
    try {
      const response = await apiClient.get<ApiResponse<ConversationDetails>>(
        `/conversations/${id}`
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async sendMessage(id: string, content: string): Promise<ConversationMessage> {
    try {
      const response = await apiClient.post<ApiResponse<ConversationMessage>>(
        `/conversations/${id}/messages`,
        { content }
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
