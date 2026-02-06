import ModalBase from "@/shared/ui/modal/ModalBase";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import type { Task } from "../types/calendar";

type TaskActionModalProps = {
  open: boolean;
  onClose: () => void;
  activeTask: { subjectId: string; task: Task } | null;
  onDelete: () => void;
  onOpenEdit: () => void;
  onOpenDate: () => void;
  onMoveTomorrow: () => void;
  taskEditOpen: boolean;
  taskDraftTitle: string;
  onChangeTaskDraftTitle: (value: string) => void;
  onSaveTaskEdit: () => void;
  onCloseTaskEdit: () => void;
  taskDateOpen: boolean;
  taskDraftDate: string;
  onChangeTaskDraftDate: (value: string) => void;
  onSaveTaskDate: () => void;
  onCloseTaskDate: () => void;
};

export default function TaskActionModal({
  open,
  onClose,
  activeTask,
  onDelete,
  onOpenEdit,
  onOpenDate,
  onMoveTomorrow,
  taskEditOpen,
  taskDraftTitle,
  onChangeTaskDraftTitle,
  onSaveTaskEdit,
  onCloseTaskEdit,
  taskDateOpen,
  taskDraftDate,
  onChangeTaskDraftDate,
  onSaveTaskDate,
  onCloseTaskDate,
}: TaskActionModalProps) {
  return (
    <>
      <ModalBase open={open} onClose={onClose}>
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTask?.task.title ?? "할 일 이름"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
              aria-label="닫기"
            >
              <HiOutlineXMark className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onOpenEdit}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-4 text-sm font-semibold text-gray-700"
            >
              <HiOutlinePencilSquare className="h-5 w-5 text-blue-500" />
              수정하기
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-4 text-sm font-semibold text-gray-700"
            >
              <HiOutlineTrash className="h-5 w-5 text-red-500" />
              삭제하기
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm font-semibold text-gray-700">
            <button
              type="button"
              onClick={onOpenDate}
              className="flex w-full items-center gap-2 bg-transparent p-0 text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                ↻
              </span>
              날짜 바꾸기
            </button>
            <button
              type="button"
              onClick={onMoveTomorrow}
              className="flex w-full items-center gap-2 bg-transparent p-0 text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                →
              </span>
              내일로 이동
            </button>
          </div>
        </div>
      </ModalBase>

      <ModalBase open={taskEditOpen} onClose={onCloseTaskEdit}>
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">할 일 수정</h2>
            <button
              type="button"
              onClick={onCloseTaskEdit}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
              aria-label="닫기"
            >
              <HiOutlineXMark className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-gray-700">할 일</div>
            <input
              value={taskDraftTitle}
              onChange={(event) => onChangeTaskDraftTitle(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-violet-400 focus:outline-none"
              placeholder="할 일을 입력하세요."
            />
          </div>
          <button
            type="button"
            onClick={onSaveTaskEdit}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow"
          >
            저장하기
          </button>
        </div>
      </ModalBase>

      <ModalBase open={taskDateOpen} onClose={onCloseTaskDate}>
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">날짜 변경</h2>
            <button
              type="button"
              onClick={onCloseTaskDate}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
              aria-label="닫기"
            >
              <HiOutlineXMark className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-gray-700">선택 날짜</div>
            <input
              type="date"
              value={taskDraftDate}
              onChange={(event) => onChangeTaskDraftDate(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-violet-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onSaveTaskDate}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow"
          >
            변경하기
          </button>
        </div>
      </ModalBase>
    </>
  );
}
