export type MenteeMe = {
  email: string;
  name: string;
  school: string;
  grade: number;
  role: string;
};

export type MenteeMeUpdateBody = {
  currentPassword?: string;
  newPassword?: string;
  name: string;
  school: string;
  grade: number;
};

export type MenteeSummarySubject = {
  totalStudySeconds: number;
  todoTotal: number;
  todoCompleted: number;
  feedbackTotal: number;
  feedbackRead: number;
  todoCompletionRate: number;
  feedbackReadRate: number;
};

export type MenteeSummaryResponse = {
  from: string;
  to: string;
  subjects: Record<string, MenteeSummarySubject>;
};
