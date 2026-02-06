import { axiosInstance } from "@/api/axiosInstance";
import type { MentorMenteeSummary } from "@/types/mentor";

export const mentorSummaryApi = {
  // GET /api/mentor/{menteeId}/summary
  getMenteeSummary: (menteeId: number) => {
    return axiosInstance.get<MentorMenteeSummary>(`/api/mentor/${menteeId}/summary`);
  },
};
