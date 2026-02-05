import {axiosInstance} from "@/api/axiosInstance";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const data = await axiosInstance.post<LoginResponse>("/api/auth/login", req);

  localStorage.setItem("accessToken", data.data.accessToken);
  if (data.data.role) localStorage.setItem("role", data.data.role);

  return data.data;
}
