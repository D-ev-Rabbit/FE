export type MentorTodo = {
  id: number;
  menteeId: number;
  creatorId?: number;
  title: string;
  date: string; // YYYY-MM-DD
  subject: string;
  goal?: string;
  state: number; // 0: 과제 미완료, 1: 피드백 대기, 2: 피드백 완료
  comment?: string;
  /** 해당 과제에 멘티가 올린 파일(이미지) 개수 */
  fileCount?: number;
};

export type MentorTodoCreateBody = {
  title: string;
  date: string;
  subject: string;
  goal?: string;
  state?: number;
};

export type MentorTodoUpdateBody = {
  title: string;
  date: string;
  subject: string;
  goal?: string;
  state: number;
};
