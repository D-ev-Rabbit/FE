export type MentorTodo = {
  id: number;
  menteeId: number;
  creatorId?: number;
  title: string;
  date: string; // YYYY-MM-DD
  subject: string;
  goal?: string;
  isCompleted: boolean;
  comment?: string;
};

export type MentorTodoCreateBody = {
  title: string;
  date: string;
  subject: string;
  goal?: string;
  isCompleted?: boolean;
};

export type MentorTodoUpdateBody = {
  title: string;
  date: string;
  subject: string;
  goal?: string;
  isCompleted: boolean;
};
