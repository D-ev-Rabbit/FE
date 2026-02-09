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
  /** 해당 과제에 멘티가 올린 파일(이미지) 개수 */
  fileCount?: number;
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
