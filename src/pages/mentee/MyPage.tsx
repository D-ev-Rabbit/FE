import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import { menteeMeApi } from "@/api/mentee/me";
import type { MenteeMe } from "@/types/mentee";

type GradeOption = { label: string; value: number };

export default function MenteeHomePage() {
  const [initial, setInitial] = useState<MenteeMe | null>(null);

  const gradeOptions: GradeOption[] = [
    { label: "고등학교 1학년", value: 1 },
    { label: "고등학교 2학년", value: 2 },
    { label: "고등학교 3학년", value: 3 },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState<number | "">("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwVisible, setPwVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultModal, setResultModal] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    description?: string;
  }>({ open: false, variant: "success", title: "" });

  useEffect(() => {
    let ignore = false;
    menteeMeApi
      .getMe()
      .then((res) => {
        if (ignore) return;
        const data = res.data;
        setInitial(data);
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setSchool(data.school ?? "");
        setGrade(typeof data.grade === "number" ? data.grade : "");
      })
      .catch(() => {
        if (ignore) return;
        setInitial(null);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const getErrorMessage = (err: unknown, fallback: string) => {
    const msg =
      (err as any)?.response?.data?.message ||
      (err as any)?.message ||
      fallback;
    return typeof msg === "string" && msg.trim().length > 0 ? msg : fallback;
  };

  const dirty =
    !!initial &&
    (name !== initial.name ||
      school !== initial.school ||
      grade !== initial.grade ||
      currentPassword.trim().length > 0 ||
      newPassword.trim().length > 0);

  const onCancel = () => {
    if (!initial) return;
    setName(initial.name);
    setSchool(initial.school);
    setGrade(initial.grade);
    setCurrentPassword("");
    setNewPassword("");
    setPwVisible(false);
  };

  const onSave = async () => {
    if (!initial || grade === "") return;
    setSaving(true);
    try {
      const payload: any = {
        name,
        school,
        grade,
      };
      if (newPassword.trim().length > 0 || currentPassword.trim().length > 0) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const res = await menteeMeApi.updateMe(payload);
      const data = res.data;
      setInitial(data);
      setName(data.name ?? "");
      setEmail(data.email ?? "");
      setSchool(data.school ?? "");
      setGrade(typeof data.grade === "number" ? data.grade : "");
      setCurrentPassword("");
      setNewPassword("");
      setResultModal({
        open: true,
        variant: "success",
        title: "저장 완료",
        description: "내 정보가 업데이트되었습니다.",
      });
    } catch (err) {
      setResultModal({
        open: true,
        variant: "error",
        title: "저장 실패",
        description: getErrorMessage(err, "저장에 실패했어요. 잠시 후 다시 시도해주세요."),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="mt-1 grid grid-cols-1 gap-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <img src="/user.png" alt="프로필" className="h-full w-full object-cover" />
            </div>

            <div className="text-xs text-gray-500 leading-relaxed">
              <div className="mt-1">이름, 비밀번호, 학년, 학교 수정 가능</div>
              <div className="mt-1">이메일 수정 불가</div>
            </div>
          </div>

          <Field label="이름">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </Field>

          <Field label="이메일">
            <input
              value={email}
              readOnly
              placeholder="이메일"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed"
            />
          </Field>

          <Field label="학교">
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="학교"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </Field>

          <Field label="현재 비밀번호">
            <div className="relative">
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type={pwVisible ? "text" : "password"}
                placeholder="현재 비밀번호"
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
              * 비밀번호 변경 시 현재 비밀번호를 입력하세요.
            </div>
          </Field>

          <Field label="새 비밀번호">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={pwVisible ? "text" : "password"}
              placeholder="새 비밀번호"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
            <div className="mt-2 text-[11px] text-gray-400">
              * 새 비밀번호를 비워두면 변경하지 않습니다.
            </div>
          </Field>

          <Field label="학년 선택">
            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value === "" ? "" : Number(e.target.value))}
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
              disabled={!dirty || saving}
              className={cn(
                "rounded-full bg-violet-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-violet-700",
                (!dirty || saving) && "opacity-50 cursor-not-allowed hover:bg-violet-600"
              )}>
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </section>

      <ConfirmModal
        open={resultModal.open}
        variant={resultModal.variant}
        title={resultModal.title}
        description={resultModal.description}
        onCancel={() => setResultModal((prev) => ({ ...prev, open: false }))}
        onConfirm={() => setResultModal((prev) => ({ ...prev, open: false }))}
        showCancel={false}
        confirmText="확인"
      />
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
