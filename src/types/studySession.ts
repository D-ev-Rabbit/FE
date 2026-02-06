export type StudySessionMode = "AUTO" | "MANUAL";

export interface StudySession {
  sessionId: number;
  date: string; // YYYY-MM-DD
  subject: string;
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
  durationSeconds: number;
  mode: StudySessionMode;
}

export interface StudySessionStartRequest {
  subject: string;
  startAt: string; // ISO 8601
}

export interface StudySessionStopRequest {
  endAt: string; // ISO 8601
}

export interface StudySessionManualRequest {
  subject: string;
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
}

export interface StudySessionStartResponse extends StudySession {}

export interface StudySessionManualResponse {
  sessions: StudySession[];
}

export interface StudySessionStopResponse {
  sessions: StudySession[];
}
