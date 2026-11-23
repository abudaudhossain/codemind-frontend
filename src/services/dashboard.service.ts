import { apiClient, unwrapApiData } from "@/services/api-client";
import { toApiClientError } from "@/lib/api-error";
import { USE_API_MOCKS } from "@/lib/feature-flags";
import { mockDashboardData, mockUser } from "@/lib/mock-data";
import type { ApiResponse, DashboardData, UserProfile } from "@/types";

export interface DashboardPayload {
  user: UserProfile;
  data: DashboardData;
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardPayload> {
    if (USE_API_MOCKS) {
      return { user: mockUser, data: mockDashboardData };
    }

    try {
      const response = await apiClient.get<ApiResponse<DashboardPayload>>(
        "/dashboard"
      );
      return unwrapApiData(response.data);
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
