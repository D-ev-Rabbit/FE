import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "";

export const uploadAxios = axios.create({
  baseURL,
  withCredentials: true,
});
uploadAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
