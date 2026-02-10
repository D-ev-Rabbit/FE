export type FileType = "PDF" | "IMAGE" | "OTHER";

export type UploadedFile = {
  id: number;
  todoId: number;
  url: string;   // 지금 백엔드는 fullPath를 url로 내려줄 수도 있음(구현 확인 필요)
  type: "PDF" | "IMG" | "ETC"; // 백엔드 enum에 맞게 조정
  creatorId: number;
}

export type FileUploadResponse = {
  id: number;
  todoId: number;
  url: string;
  type: "PDF" | "IMG" | "ETC";
  creatorId: number;
};

export type TodoFile = {
  fileId: number;
  url: string;
  type: string; // "png" | "jpg" | "pdf" 등
  version: string | null;
  feedbacks: unknown[];
};

export type MenteeTodo = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  subject: string;
  goal: string;
  state: number; // 0: 과제 미완료, 1: 피드백 대기, 2: 피드백 완료
  comment: string | null;
  files?: TodoFile[];
  // 나머지 필드 있으면 유지
};
