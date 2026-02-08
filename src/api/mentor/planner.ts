import { axiosInstance } from "@/api/axiosInstance";

export type MentorPlannerCommentBody = {
  comment: string;
};

export type MentorPlannerCommentResponse = {
  plannerId: number;
  date: string;
  comment: string;
};

export const mentorPlannerApi = {
  // GET /api/mentor/mentees/{menteeId}/planners/comment?date=YYYY-MM-DD
  getPlannerComment: (menteeId: number, date: string) => {
    return axiosInstance.get<MentorPlannerCommentResponse>(
      `/api/mentor/mentees/${menteeId}/planners/comment`,
      { params: { date } }
    );
  },

  // PATCH /api/mentor/mentees/{menteeId}/planners/comment?date=YYYY-MM-DD
  patchPlannerComment: (menteeId: number, date: string, body: MentorPlannerCommentBody) => {
    return axiosInstance.patch<MentorPlannerCommentResponse>(
      `/api/mentor/mentees/${menteeId}/planners/comment`,
      body,
      { params: { date } }
    );
  },
};
