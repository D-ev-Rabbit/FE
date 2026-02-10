export type TaskStatus = 0 | 1 | 2;

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
