import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<"mentor" | "mentee">("mentor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }

    if (role === "mentor") navigate("/mentor/home");
    else navigate("/mentee/home");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">

        {/* 아바타 */}
        <div className="mx-auto mb-3 flex flex-col items-center justify-center gap-2 ">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">
            ✦
          </div>
          <div className="text-sm font-bold tracking-wide text-violet-600">
            설스터디
          </div>
        </div>


        {/* Welcome */}
        <div className="text-center mb-5">
          <p className="text-sm font-semibold text-violet-600">Welcome</p>
        </div>

        {/* 멘토 / 멘티 토글 */}
        <div
          className="
      relative grid grid-cols-2 items-center
      rounded-2xl p-1.5
      bg-gray-100
      ring-1 ring-black/5
    "
        >
          {/* 선택된 pill */}
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

          {/* 멘토 */}
          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`
        relative z-10 h-11 rounded-xl
        text-sm font-semibold transition-all duration-200
        active:scale-[0.97]
        ${role === "mentor"
                ? "text-violet-600 font-bold"
                : "text-gray-400 hover:text-gray-600"
              }
      `}
          >
            멘토
          </button>

          {/* 멘티 */}
          <button
            type="button"
            onClick={() => setRole("mentee")}
            className={`
        relative z-10 h-11 rounded-xl
        text-sm font-semibold transition-all duration-200
        active:scale-[0.97]
        ${role === "mentee"
                ? "text-violet-600 font-bold"
                : "text-gray-400 hover:text-gray-600"
              }`}>
            멘티
          </button>
        </div>


        {/* 상단 안내 (멘토 선택 시만) */}
        {role === "mentor" && (
          <div
            className={`
      mt-4 text-center text-sm text-gray-500
      transition-all duration-300 ease-out
      ${role === "mentor"
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 h-0 overflow-hidden"
              }
    `}
          >
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
            <label className="text-xs font-medium text-violet-600">
              비밀번호
            </label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 
                    bg-transparent p-0 
                    border-none outline-none 
                    focus:outline-none focus:ring-0"
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

        {/* 비밀번호 찾기 (테두리 제거) */}
        <div className="mt-3 text-right">
          <button
            type="button"
            className="text-xs text-violet-600 bg-white hover:underline focus:border-transparent focus:outline-none focus:ring-0 hover:border-transparent hover:underline"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 로그인 */}
        <button
          onClick={handleLogin}
          className="mt-5 w-full rounded-xl bg-violet-700 py-3 text-sm font-semibold text-white hover:bg-violet-800"
        >
          로그인
        </button>

        {/* 회원가입 (테두리 제거) */}
        <div className="mt-4 text-center text-xs text-gray-500">
          계정이 없다면?{" "}
          <button
            type="button"
            className="
              rounded-xl px-3 py-2 text-sm font-semibold text-violet-600
              bg-white
              hover:border-transparent hover:underline
              focus:border-transparent focus:outline-none focus:ring-0
              active:border-transparent
              transition">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
