import { axiosInstance } from "@/api/axiosInstance";
import type { MenteeMe, MenteeMeUpdateBody, MenteeSummaryResponse } from "@/types/mentee";

export const menteeMeApi = {
  // GET /api/mentee/me
  getMe: () => axiosInstance.get<MenteeMe>("/api/mentee/me"),

  // PATCH /api/mentee/me
  updateMe: (body: MenteeMeUpdateBody) => axiosInstance.patch<MenteeMe>("/api/mentee/me", body),

  // GET /api/mentee/me/summary
  getSummary: () => axiosInstance.get<MenteeSummaryResponse>("/api/mentee/me/summary"),
};
