import type { NotificationType } from "@/types/notification";

export type Notice = {
  id?: string;
  type: NotificationType;
  title: string;
  timeLabel: string;
  todoId?: number | null;
  plannerDate?: string | null;
};
