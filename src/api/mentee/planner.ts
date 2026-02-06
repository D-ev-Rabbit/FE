import { axiosInstance } from "@/api/axiosInstance";
import type { MenteePlannerResponse } from "@/types/planner";

export const menteePlannerApi = {
  // GET /api/mentee/planners?date=YYYY-MM-DD
  getPlannerByDate: (date: string) => {
    return axiosInstance.get<MenteePlannerResponse>("/api/mentee/planners", {
      params: { date },
    });
  },
};
