import { apiClient } from "../network/apiClient";

const notificationApiProvider = {
  // Get admin notifications
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(`/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return { success: false, message: error?.message || "Error fetching notifications" };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put("/notifications/read");
      return response.data;
    } catch (error) {
      return { success: false, message: error?.message || "Error marking notifications as read" };
    }
  },
};

export default notificationApiProvider;
