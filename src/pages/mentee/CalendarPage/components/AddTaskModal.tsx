import ModalBase from "@/shared/ui/modal/ModalBase";
import { HiOutlineXMark } from "react-icons/hi2";

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  selectedSubject: string;
  taskDraftText: string;
  weekdays: string[];
  selectedWeekdays: string[];
  repeatMode: "weekly" | "once";
  onToggleWeekday: (day: string) => void;
  onSetRepeatMode: (mode: "weekly" | "once") => void;
  onChangeTaskDraftText: (value: string) => void;
  onAddTask: () => void;
};

export default function AddTaskModal({
  open,
  onClose,
  selectedSubject,
  taskDraftText,
  weekdays,
  selectedWeekdays,
  repeatMode,
  onToggleWeekday,
  onSetRepeatMode,
  onChangeTaskDraftText,
  onAddTask,
}: AddTaskModalProps) {
  return (
    <ModalBase open={open} onClose={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">할 일 추가</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
            aria-label="닫기"
          >
            <HiOutlineXMark className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <div className="text-sm font-semibold text-gray-700">과목</div>
          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-500">
            {selectedSubject}
          </div>
        </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-gray-700">할 일</div>
            <input
              value={taskDraftText}
              onChange={(event) => onChangeTaskDraftText(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-violet-400 focus:outline-none"
              placeholder="할 일을 입력하세요."
            />
          </div>

        <div className="mt-5 space-y-2">
          <div className="text-sm font-semibold text-gray-700">요일 선택</div>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => {
              const active = selectedWeekdays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onToggleWeekday(day)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    active
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onSetRepeatMode("weekly")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${
              repeatMode === "weekly"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            매주
          </button>
          <button
            type="button"
            onClick={() => onSetRepeatMode("once")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${
              repeatMode === "once"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            이번주만
          </button>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow"
        >
          추가하기
        </button>
      </div>
    </ModalBase>
  );
}
