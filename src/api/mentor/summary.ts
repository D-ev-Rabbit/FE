import { axiosInstance } from "@/api/axiosInstance";
import type { MentorMenteeSummary } from "@/types/mentor";

export const mentorSummaryApi = {
  /** GET /api/mentor/{menteeId}/summary — date 있으면 해당 일자만 집계 */
  getMenteeSummary: (menteeId: number, date?: string) => {
    const params = date ? { date } : undefined;
    return axiosInstance.get<MentorMenteeSummary>(`/api/mentor/${menteeId}/summary`, { params });
  },
};
