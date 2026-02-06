import type { Notice } from "./types";

export const mockNotices: Notice[] = [
  { id: "1", type: "TODO_COMMENT", title: "수학 과제에 코멘트가 달렸어요", timeLabel: "방금 전" },
  { id: "2", type: "FILE_FEEDBACK", title: "파일 피드백이 도착했어요", timeLabel: "10분 전" },
  { id: "3", type: "PLANNER_COMMENT", title: "플래너 피드백이 달렸어요", timeLabel: "1시간 전" },
  { id: "4", type: "TODO_INCOMPLETE", title: "오늘 과제를 아직 제출하지 않았어요", timeLabel: "2시간 전" },
];
