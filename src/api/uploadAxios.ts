import axios from "axios";

export const uploadAxios = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "",
  withCredentials: false,
});

uploadAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
