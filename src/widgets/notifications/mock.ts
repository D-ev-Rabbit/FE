import type { Notice } from "./types";

export const mockNotices: Notice[] = [
  { id: "1", category: "task_feedback", title: "수학 과제 피드백이 달렸어요", timeLabel: "방금 전" },
  { id: "2", category: "planner_feedback", title: "플래너 피드백이 달렸어요", timeLabel: "10분 전" },
  { id: "3", category: "task_missing", title: "오늘 과제를 아직 제출하지 않았어요", timeLabel: "1시간 전" },
];
