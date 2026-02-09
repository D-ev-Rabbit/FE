import type { NotificationType } from "@/types/notification";

export type Notice = {
  id?: string;
  type: NotificationType;
  title: string;
  timeLabel: string;
  /** 과제 피드백/코멘트일 때 해당 과제 상세로 이동용 */
  todoId?: number | null;
  /** 플래너 피드백일 때 해당 날짜로 이동용 */
  plannerId?: number | null;
  plannerDate?: string | null;
};
