export type TaskStatus = "done" | "pending";

export type TaskItem = {
  id: number;
  title: string;
  status: TaskStatus;
  isMine?: boolean;
};

export type SubjectSection = {
  id: string;
  label: string;
  tasks: TaskItem[];
};

export type FeedbackSummary = {
  id: number;
  text: string;
};
