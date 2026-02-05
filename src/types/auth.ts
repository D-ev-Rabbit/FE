/** 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
  role: "MENTOR" | "MENTEE";
}

/** 로그인 응답 (백엔드 실제 응답 기준) */
export interface LoginResponse {
  accessToken: string;
  role: "MENTOR" | "MENTEE" | null; 
}