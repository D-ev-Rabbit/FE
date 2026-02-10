import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { login } from "@/api/auth"; 
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<"mentor" | "mentee">("mentor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }

    try {
      setLoading(true);

      const serverRole = role === "mentor" ? "MENTOR" : "MENTEE";
      const res = await login({ email, password, role: serverRole });

      // 응답 role이 null이면 요청 role 기준으로 라우팅
      const finalRole = res.role ?? serverRole;

      if (finalRole === "MENTOR") navigate("/mentor/home");
      else navigate("/mentee/calendar");
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        const serverMessage = e.response?.data?.message;
        setError(serverMessage ?? "로그인에 실패했습니다.");
      } else {
        setError(e?.message ?? "로그인에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        {/* 로고 */}
        <div className="mx-auto mb-3 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="설스터디 로고"
            className="h-10 w-auto"
          />
        </div>

        {/* Welcome */}
        <div className="text-center mb-5">
          <p className="text-sm font-semibold text-violet-600">Welcome</p>
        </div>

        {/* 멘토 / 멘티 토글 */}
        <div className="relative grid grid-cols-2 items-center rounded-2xl p-1.5 bg-gray-100 ring-1 ring-black/5">
          <div
            className={`
              absolute top-1.5 left-1.5
              h-[calc(100%-10px)] w-[calc(50%-6px)]
              rounded-xl
              bg-gradient-to-b from-violet-500 to-violet-600
              shadow-md
              transition-transform duration-300 ease-out
              ${role === "mentee" ? "translate-x-full" : "translate-x-0"}
            `}
          />

          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`
              relative z-10 h-11 rounded-xl
              text-sm font-semibold transition-all duration-200
              active:scale-[0.97]
              ${role === "mentor"
                ? "text-violet-600 font-bold"
                : "text-gray-400 hover:text-gray-600"}
            `}
          >
            멘토
          </button>

          <button
            type="button"
            onClick={() => setRole("mentee")}
            className={`
              relative z-10 h-11 rounded-xl
              text-sm font-semibold transition-all duration-200
              active:scale-[0.97]
              ${role === "mentee"
                ? "text-violet-600 font-bold"
                : "text-gray-400 hover:text-gray-600"}
            `}
          >
            멘티
          </button>
        </div>

        {role === "mentor" && (
          <div className="mt-4 text-center text-sm text-gray-500">
            원활한 피드백을 위해 PC 접속을 권장합니다.
          </div>
        )}

        {/* 입력 */}
        <div className="mt-2 space-y-4">
          <div>
            <label className="text-xs font-medium text-violet-600">이메일</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-violet-400 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-violet-600">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-violet-400 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-200"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent p-0 border-none outline-none focus:outline-none focus:ring-0"
              >
                {showPw ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-violet-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-violet-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* 로그인 */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`
            mt-10 w-full rounded-xl py-3 text-sm font-semibold text-white
            ${loading ? "bg-violet-400 cursor-not-allowed" : "bg-violet-700 hover:bg-violet-800"}
          `}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
