import { uploadAxios } from "@/api/uploadAxios";
import { axiosInstance } from "@/api/axiosInstance";

export type FileUploadResponse = {
  id: number;
  todoId: number;
  url: string; // 다운로드 API 경로: /api/files/{id}/download
  name?: string;
  type: "PDF" | "JPG" | "PNG";
  creatorId: number;
};

export type MentorTodoFile = {
  id: number;
  todoId: number;
  url: string; // 다운로드 API 경로: /api/files/{id}/download
  name?: string;
  type: "PDF" | "JPG" | "PNG" | string;
  creatorId: number;
};

/** 다운로드/미리보기용 URL 반환 (base 미설정 시 상대 경로 그대로) */
export function getFileDownloadUrl(fileId: number): string {
  const base =
    (uploadAxios.defaults.baseURL ?? "") ||
    (axiosInstance.defaults.baseURL ?? "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const path = `/api/files/${fileId}/download`;
  return base ? `${base.replace(/\/$/, "")}${path}` : path;
}

export const fileApi = {
  uploadFile: (todoId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return uploadAxios.post<FileUploadResponse>(`/api/files/upload/${todoId}`, formData);
  },
  getMentorTodoFiles: (todoId: number) => {
    return uploadAxios.get<MentorTodoFile[]>(`/api/files/todos/${todoId}/mentor`);
  },
  /** Bearer 토큰으로 파일 바디 fetch (이미지 미리보기 등) */
  fetchFileBlob: (url: string) => {
    const token = localStorage.getItem("accessToken");
    const base =
      (uploadAxios.defaults.baseURL ?? "") ||
      (axiosInstance.defaults.baseURL ?? "") ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const path = url.startsWith("http") ? "" : url.replace(/^\//, "");
    const fullUrl = url.startsWith("http") ? url : [base.replace(/\/$/, ""), path].filter(Boolean).join("/");
    return fetch(fullUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => {
      if (!res.ok) throw new Error("File fetch failed");
      return res.blob();
    });
  },
  postMentorFeedback: (fileId: number, body: { data: string }) => {
    return uploadAxios.post<{ id: number; data: string }>(`/api/mentor/files/${fileId}/feedback`, body);
  },
  getMentorFeedback: (fileId: number) => {
    return uploadAxios.get<{ id: number; data: string }>(`/api/mentor/files/${fileId}/feedback`);
  },
};
