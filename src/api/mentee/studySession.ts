import { axiosInstance } from "@/api/axiosInstance";
import type {
  StudySession,
  StudySessionManualRequest,
  StudySessionManualResponse,
  StudySessionStartRequest,
  StudySessionStartResponse,
  StudySessionStopRequest,
  StudySessionStopResponse,
} from "@/types/studySession";

export const menteeStudySessionApi = {
  // POST /api/mentee/study-sessions/start
  start: (body: StudySessionStartRequest) => {
    return axiosInstance.post<StudySessionStartResponse>(
      "/api/mentee/study-sessions/start",
      body
    );
  },

  // POST /api/mentee/study-sessions/manual
  createManual: (body: StudySessionManualRequest) => {
    return axiosInstance.post<StudySessionManualResponse>(
      "/api/mentee/study-sessions/manual",
      body
    );
  },

  // PATCH /api/mentee/study-sessions/{sessionId}/stop
  stop: (sessionId: number, body: StudySessionStopRequest) => {
    return axiosInstance.patch<StudySessionStopResponse>(
      `/api/mentee/study-sessions/${sessionId}/stop`,
      body
    );
  },

  // GET /api/mentee/study-sessions?date=YYYY-MM-DD
  getByDate: (date: string) => {
    return axiosInstance.get<StudySession[]>("/api/mentee/study-sessions", {
      params: { date },
    });
  },

  // DELETE /api/mentee/study-sessions/{sessionId}
  delete: (sessionId: number) => {
    return axiosInstance.delete<void>(`/api/mentee/study-sessions/${sessionId}`);
  },
};
