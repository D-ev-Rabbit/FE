import { uploadAxios } from "@/api/uploadAxios";

export type FileUploadResponse = {
  id: number;
  todoId: number;
  url: string;
  type: "PDF" | "IMG" | "ETC";
  creatorId: number;
};

export const fileApi = {
  uploadFile: (todoId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return uploadAxios.post<FileUploadResponse>(`/api/files/upload/${todoId}`, formData);
  },
};
