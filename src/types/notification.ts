export type NotificationType =
  | "TODO_COMMENT"
  | "FILE_FEEDBACK"
  | "PLANNER_COMMENT"
  | "TODO_INCOMPLETE";

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  message: string;
  subject: string | null;
  todoId: number | null;
  fileId: number | null;
  plannerId: number | null;
  plannerDate: string | null;
  targetDate: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationResponse[];
}

export interface NotificationReadResponse {
  id: number;
  isRead: boolean;
}
