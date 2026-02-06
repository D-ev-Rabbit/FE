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
  todoCompletionRate: number;
  feedbackReadRate: number;
};

export type MentorMenteeSummary = {
  from: string;
  to: string;
  subjects: Record<string, MentorSummarySubject>;
};
