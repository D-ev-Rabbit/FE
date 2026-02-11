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
  fetchFileBlob: async (url: string, fileId?: number) => {
    const token = localStorage.getItem("accessToken");
    const base =
      (uploadAxios.defaults.baseURL ?? "") ||
      (axiosInstance.defaults.baseURL ?? "") ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const raw = String(url ?? "").trim();
    const isAbsolute = raw.startsWith("http");
    const isApiPath = raw.startsWith("/api/");
    const isFileSystemPath = raw.startsWith("/Users/") || raw.startsWith("Users/");
    const fallback = typeof fileId === "number" ? getFileDownloadUrl(fileId) : "";
    const targetUrl = isFileSystemPath
      ? fallback
      : isAbsolute
        ? raw
        : isApiPath
          ? [base.replace(/\/$/, ""), raw.replace(/^\//, "")].filter(Boolean).join("/")
          : raw
            ? [base.replace(/\/$/, ""), raw.replace(/^\//, "")].filter(Boolean).join("/")
            : fallback;
    if (!targetUrl) throw new Error("File fetch failed");

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const res = await fetch(targetUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) return res.blob();
      if (attempt === 0) {
        await sleep(300);
        continue;
      }
      throw new Error("File fetch failed");
    }
    throw new Error("File fetch failed");
  },
  postMentorFeedback: (fileId: number, body: { data: string }) => {
    return uploadAxios.post<{ id: number; data: string }>(`/api/mentor/files/${fileId}/feedback`, body);
  },
  getMentorFeedback: (fileId: number) => {
    return uploadAxios.get<{ id: number; data: string }>(`/api/mentor/files/${fileId}/feedback`);
  },
};
