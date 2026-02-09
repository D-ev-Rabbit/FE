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
  /** 제출했지만 아직 피드백이 없는 과제(Todo) 수 */
  pendingFeedbackTodoCount?: number;
  /** 피드백이 이루어진 해결완료 과제(Todo) 수 */
  feedbackCompletedTodoCount?: number;
  todoCompletionRate: number;
  feedbackReadRate: number;
};

export type MentorMenteeSummary = {
  from: string;
  to: string;
  subjects: Record<string, MentorSummarySubject>;
};
