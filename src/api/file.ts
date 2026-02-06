import { axiosInstance } from "@/api/axiosInstance";
import type { FileUploadResponse } from "@/types/file";

export const fileApi = {
  // POST /api/files/upload/{todoId}
  uploadFile: (todoId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post<FileUploadResponse>(
      `/api/files/upload/${todoId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};
