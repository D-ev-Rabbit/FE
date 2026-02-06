export type FileType = "PDF" | "IMAGE" | "OTHER";

export interface FileUploadResponse {
  id: number;
  todoId: number;
  url: string;
  type: FileType;
  creatorId: number;
}
