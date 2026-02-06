import { axiosInstance } from "@/api/axiosInstance";
import type { MentorMentee } from "@/types/mentor";

export const mentorMenteeApi = {
  // GET /api/mentor/mentees
  getMentees: () => {
    return axiosInstance.get<MentorMentee[]>("/api/mentor/mentees");
  },

  // POST /api/mentor/{menteeId}/assign
  assignMentee: (menteeId: number) => {
    return axiosInstance.post<void>(`/api/mentor/${menteeId}/assign`);
  },
};
