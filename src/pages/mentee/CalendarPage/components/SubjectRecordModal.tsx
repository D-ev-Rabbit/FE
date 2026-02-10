import ModalBase from "@/shared/ui/modal/ModalBase";

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

        <div className="mt-4 h-[180px]">
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
                  <input
                    type="time"
                    value={manualStart}
                    onChange={(event) => onChangeManualStart(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">종료</div>
                  <input
                    type="time"
                    value={manualEnd}
                    onChange={(event) => onChangeManualEnd(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
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
                className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-base font-semibold text-white"
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
