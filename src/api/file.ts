import { uploadAxios } from "@/api/uploadAxios";

export type FileUploadResponse = {
  id: number;
  todoId: number;
  url: string;
  type: "PDF" | "IMG" | "ETC";
  creatorId: number;
};

export type MentorTodoFile = {
  id: number;
  todoId: number;
  url: string;
  type: "PDF" | "IMG" | "ETC" | string;
  creatorId: number;
};

export const fileApi = {
  uploadFile: (todoId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return uploadAxios.post<FileUploadResponse>(`/api/files/upload/${todoId}`, formData);
  },
  getMentorTodoFiles: (todoId: number) => {
    return uploadAxios.get<MentorTodoFile[]>(`/api/files/todos/${todoId}/mentor`);
  },
  postMentorFeedback: (fileId: number, body: { data: string }) => {
    return uploadAxios.post<{ id: number; data: string }>(`/api/mentor/files/${fileId}/feedback`, body);
  },
  getMentorFeedback: (fileId: number) => {
    return uploadAxios.get<{ id: number; data: string }>(`/api/mentor/files/${fileId}/feedback`);
  },
};
