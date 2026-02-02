export type NoticeCategory = "task" | "todo" | "feedback" | "system";

export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  timeLabel: string;
  read?: boolean;
};
