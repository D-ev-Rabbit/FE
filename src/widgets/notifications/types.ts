export type NoticeCategory = "task_feedback" | "planner_feedback" | "task_missing";

export type Notice = {
  id?: string;
  category: NoticeCategory;
  title: string;
  timeLabel: string;
};
