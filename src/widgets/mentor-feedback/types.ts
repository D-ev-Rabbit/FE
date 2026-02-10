export type Subject = "국어" | "영어" | "수학";
export type ToolMode = "pin" | "pan";
export type PinsByImage = Record<number, Pin[]>;

export type Pin = {
  number: number; // 화면에 보이는 번호
  x: number;      // 0 ~ 1 (이미지 기준 상대좌표)
  y: number;      // 0 ~ 1
  text: string;   // 코멘트
};


export type Submission = {
  id: string;
  menteeName: string;
  gradeLabel: string;
  submittedAt: string; // "25/12/2023" 같은 문자열
  subject: Subject;
  title?: string;
  goal?: string;
  state?: number; // 0: 과제 미완료, 1: 피드백 대기, 2: 피드백 완료
  menteeId?: number;
  /** 목록에서 표시용: 멘티가 올린 파일(이미지) 개수 */
  fileCount?: number;
  files: {
    fileId: number;
    url: string; // 다운로드 API 경로: /api/files/{id}/download
    type?: string; // "image", "pdf" 등 (미리보기 분기용)
    name?: string;
    feedbacks?: { data?: string; feedbackId?: number }[];
  }[];
};
