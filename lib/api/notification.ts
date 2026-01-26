import apiClient from "./axios";

export const notificationServices = {
  // Add community related API calls here if needed
  //   /notification/my-notifications
  async getMyNotifications() {
    return apiClient.get("/notification/my-notifications");
  },
  //   markAllAsRead
  // /notification/mark-all-read
  async markAllAsRead() {
    return apiClient.patch("/notification/mark-all-read");
  },
  // markAsRead/
  // /notification/{id}/read
  async markAsRead(notificationId: string) {
    return apiClient.post(`/notification/${notificationId}/read`);
  },
};
