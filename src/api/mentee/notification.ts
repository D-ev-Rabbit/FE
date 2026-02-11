import { axiosInstance } from "@/api/axiosInstance";
import type {
  NotificationListResponse,
  NotificationReadResponse,
} from "@/types/notification";

export const menteeNotificationApi = {
  // GET /api/mentee/notifications?unreadOnly=true|false
  getNotifications: (unreadOnly = true) => {
    return axiosInstance.get<NotificationListResponse>("/api/mentee/notifications", {
      params: { unreadOnly },
    });
  },

  // PATCH /api/mentee/notifications/{notificationId}/read
  markRead: (notificationId: number) => {
    return axiosInstance.patch<NotificationReadResponse>(
      `/api/mentee/notifications/${notificationId}/read`
    );
  },

  // notifyFileFeedback(fileId: number) {
  //   return axiosInstance.post(
  //     `/api/mentor/notifications/feedback/${fileId}`
  //   );
  // }

  notifyTodoFeedback(todoId: number) {
    return axiosInstance.post(`/api/mentor/notifications/feedback/todo/${todoId}`);
  },
};
