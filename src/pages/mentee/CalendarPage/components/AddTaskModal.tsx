import ModalBase from "@/shared/ui/modal/ModalBase";
import { HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/shared/lib/cn";

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  selectedSubject: string;
  taskDraftText: string;
  onChangeTaskDraftText: (value: string) => void;
  onAddTask: () => void;
  errorMessage?: string;
};

export default function AddTaskModal({
  open,
  onClose,
  selectedSubject,
  taskDraftText,
  onChangeTaskDraftText,
  onAddTask,
  errorMessage,
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
              className={cn(
                "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:outline-none",
                errorMessage ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-violet-400"
              )}
              placeholder="할 일을 입력하세요."
            />
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
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
