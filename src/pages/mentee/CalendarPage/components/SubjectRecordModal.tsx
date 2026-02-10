import ModalBase from "@/shared/ui/modal/ModalBase";
import { HiOutlineClock } from "react-icons/hi2";

type SubjectRecordModalProps = {
  open: boolean;
  subjectName: string;
  mode: "auto" | "manual";
  autoRunning: boolean;
  elapsedLabel: string;
  manualStart: string;
  manualEnd: string;
  manualError?: string;
  autoError?: string;
  onClose: () => void;
  onChangeMode: (mode: "auto" | "manual") => void;
  onToggleAuto: () => void;
  onChangeManualStart: (value: string) => void;
  onChangeManualEnd: (value: string) => void;
  onSaveManual: () => void;
};

const formatTimeDisplay = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function SubjectRecordModal({
  open,
  subjectName,
  mode,
  autoRunning,
  elapsedLabel,
  manualStart,
  manualEnd,
  manualError,
  autoError,
  onClose,
  onChangeMode,
  onToggleAuto,
  onChangeManualStart,
  onChangeManualEnd,
  onSaveManual,
}: SubjectRecordModalProps) {
  return (
    <ModalBase open={open} onClose={onClose}>
      <div className="w-full min-w-[320px] max-w-md rounded-3xl bg-white px-5 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
              {subjectName}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500"
          >
            닫기
          </button>
        </div>

        <div className="mt-3 rounded-2xl bg-gray-100 p-1">
          <div className="grid grid-cols-2 gap-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => onChangeMode("auto")}
              className={`rounded-xl px-3 py-2 ${
                mode === "auto" ? "bg-violet-500 text-white" : "text-gray-500"
              }`}
            >
              자동 기록
            </button>
            <button
              type="button"
              onClick={() => onChangeMode("manual")}
              className={`rounded-xl px-3 py-2 ${
                mode === "manual" ? "bg-violet-500 text-white" : "text-gray-500"
              }`}
            >
              수동 입력
            </button>
          </div>
        </div>

        <div className="mt-4">
          {mode === "auto" ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-5 text-center">
              <div className="text-3xl font-semibold text-gray-800">{elapsedLabel}</div>
              <button
                type="button"
                onClick={onToggleAuto}
                className={`mt-4 w-full rounded-2xl px-4 py-3 text-base font-semibold ${
                  autoRunning
                    ? "bg-gray-400 text-white"
                    : "bg-gradient-to-r from-violet-400 to-rose-400 text-white"
                }`}
              >
                {autoRunning ? "종료" : "시작"}
              </button>
              {autoError && (
                <div className="mt-2 text-xs font-semibold text-rose-500">
                  {autoError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-500">시작</div>
                  <div className="relative mt-1">
                    <div className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] font-semibold text-gray-800">
                      <span>{formatTimeDisplay(manualStart)}</span>
                      <HiOutlineClock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      value={manualStart}
                      onChange={(event) => onChangeManualStart(event.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="시작 시간"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">종료</div>
                  <div className="relative mt-1">
                    <div className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] font-semibold text-gray-800">
                      <span>{formatTimeDisplay(manualEnd)}</span>
                      <HiOutlineClock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      value={manualEnd}
                      onChange={(event) => onChangeManualEnd(event.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="종료 시간"
                    />
                  </div>
                </div>
              </div>
              {manualError && (
                <div className="text-xs font-semibold text-rose-500">
                  {manualError}
                </div>
              )}
              <button
                type="button"
                onClick={onSaveManual}
                className="w-full rounded-2xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white"
              >
                기록 저장
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalBase>
  );
}