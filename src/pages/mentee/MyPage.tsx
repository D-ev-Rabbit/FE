import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";

type GradeOption = { label: string; value: string };

export default function MenteeHomePage() {
  // TODO: 실제로는 서버에서 가져온 값으로 초기화
  const initial = useMemo(
    () => ({
      name: "홍길동",
      email: "hong@test.com",
      grade: "hs1",
    }),
    []
  );

  const gradeOptions: GradeOption[] = [
    { label: "고등학교 1학년", value: "hs1" },
    { label: "고등학교 2학년", value: "hs2" },
    { label: "고등학교 3학년", value: "hs3" },
  ];

  const [name, setName] = useState(initial.name);
  const [email] = useState(initial.email); // 수정 불가
  const [grade, setGrade] = useState(initial.grade);

  const [password, setPassword] = useState("");
  const [pwVisible, setPwVisible] = useState(false);

  const dirty =
    name !== initial.name || grade !== initial.grade || password.trim().length > 0;

  const onCancel = () => {
    setName(initial.name);
    setGrade(initial.grade);
    setPassword("");
    setPwVisible(false);
  };

  const onSave = async () => {
    // TODO: API 연결
    // - name, grade 업데이트
    // - password는 입력한 경우에만 변경 요청
    console.log({ name, grade, password: password ? "*****" : "" });
    setPassword("");
  };

  return (
    <div className="space-y-4">
      {/* 카드 */}
      <section className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
        {/* 폼 */}
        <div className="mt-1 grid grid-cols-1 gap-5">
          {/* 프로필 */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <img src="/user.png" alt="프로필" className="h-full w-full object-cover" />
            </div>

            <div className="text-xs text-gray-500 leading-relaxed">
              <div className="mt-1">이름, 비밀번호, 학년 수정 가능</div>
              <div className="mt-1">이메일 수정 불가</div>
            </div>
          </div>

          {/* 이름 */}
          <Field label="이름">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </Field>

          {/* 이메일 (readonly) */}
          <Field label="이메일">
            <input
              value={email}
              readOnly
              placeholder="이메일"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed"
            />
          </Field>

          {/* 비밀번호 */}
          <Field label="비밀번호">
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={pwVisible ? "text" : "password"}
                placeholder="비밀번호"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-violet-400"
              />
              <button
                type="button"
                onClick={() => setPwVisible((v) => !v)}
                className="btn-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 hover:bg-gray-100"
                aria-label={pwVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {pwVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="mt-2 text-[11px] text-gray-400">
              * 비밀번호를 입력한 경우에만 변경됩니다.
            </div>
          </Field>

          {/* 학년 선택 */}
          <Field label="학년 선택">
            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className={cn(
                  "w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none",
                  "focus:border-violet-400"
                )}
              >
                <option value="" disabled>
                  선택
                </option>
                {gradeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </Field>

          {/* actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-violet-400 bg-white px-4 py-2.5 text-sm font-extrabold text-violet-600 hover:bg-violet-50">
              취소
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={!dirty}
              className={cn(
                "rounded-full bg-violet-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-violet-700",
                !dirty && "opacity-50 cursor-not-allowed hover:bg-violet-600"
              )}>
              저장
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm font-bold text-gray-900">{label}</div>
      {children}
    </div>
  );
}
