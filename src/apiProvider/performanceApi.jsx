import { apiClient } from "../network/apiClient";
import { getErrorMessage } from "../utils/errorHandler";

const BASE_PATH = "/admin/period-report";

const performanceApiProvider = {
  getMemberPerformance: async (memberId) => {
    try {
      // The backend expects an array of memberIds and pagination parameters
      const response = await apiClient.post(`${BASE_PATH}/run`, {
        memberIds: [memberId],
        page: 1,
        limit: 10
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching member performance:", error);
      throw getErrorMessage(error);
    }
  },

  getMemberPerformanceDetails: async (memberId, metric, timeFilter) => {
    try {
      const response = await apiClient.post(`${BASE_PATH}/details`, {
        memberId,
        metric,
        timeFilter
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching performance details:", error);
      throw getErrorMessage(error);
    }
  },
};

export default performanceApiProvider;
