import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "",
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
