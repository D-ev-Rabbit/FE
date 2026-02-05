import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: false,
});

axiosInstance.interceptors.response.use(
  (res) => {
    const body = res;
    if (body && typeof body === "object" && "success" in body) {
      if (body.success) return body.data;       // 성공이면 data만 리턴
      // 실패면 error message로 throw
      throw new Error(body.data.error?.message ?? "요청 실패");
    }

    return body;
  },
  (err) => {
    return Promise.reject(err);
  }
);
