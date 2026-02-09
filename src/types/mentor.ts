export type MentorMentee = {
  id: number;
  name: string;
  school: string;
  grade: number;
};

export type MentorSummarySubject = {
  totalStudySeconds: number;
  todoTotal: number;
  todoCompleted: number;
  feedbackTotal: number;
  feedbackRead: number;
  /** 멘티가 제출한 파일 수 */
  submittedFileCount?: number;
  /** 피드백이 1개 이상 작성된 과제(Todo) 수 */
  feedbackCompletedTodoCount?: number;
  todoCompletionRate: number;
  feedbackReadRate: number;
};

export type MentorMenteeSummary = {
  from: string;
  to: string;
  subjects: Record<string, MentorSummarySubject>;
};
