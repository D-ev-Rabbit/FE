import ModalBase from "@/shared/ui/modal/ModalBase";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineEllipsisHorizontal,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import type { MonthCell, MonthGoal, SubjectGroup, Task } from "../types/calendar";
import { dayLabels } from "../utils/date";

type MonthlyViewProps = {
  monthLabel: string;
  monthGrid: MonthCell[];
  currentDate: Date;
  todayLabel: string;
  monthGoals: MonthGoal[];
  subjects: SubjectGroup[];
  openSubjects: Record<string, boolean>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  onAddGoal: () => void;
  onToggleGoalDone: (goalId: string) => void;
  onOpenGoalActions: (goalId: string) => void;
  onAddTask: (subjectName: string) => void;
  onToggleSubject: (id: string) => void;
  onToggleTaskDone: (subjectId: string, taskId: string) => void;
  onOpenTaskActions: (subjectId: string, task: Task) => void;
  goalModalOpen: boolean;
  goalDraftTitle: string;
  goalEditId: string | null;
  goalActionOpen: boolean;
  onChangeGoalDraftTitle: (value: string) => void;
  onCloseGoalModal: () => void;
  onSaveGoal: () => void;
  onCloseGoalAction: () => void;
  onOpenEditGoal: () => void;
  onDeleteGoal: () => void;
};

export default function MonthlyView({
  monthLabel,
  monthGrid,
  currentDate,
  todayLabel,
  monthGoals,
  subjects,
  openSubjects,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onAddGoal,
  onToggleGoalDone,
  onOpenGoalActions,
  onAddTask,
  onToggleSubject,
  onToggleTaskDone,
  onOpenTaskActions,
  goalModalOpen,
  goalDraftTitle,
  goalEditId,
  goalActionOpen,
  onChangeGoalDraftTitle,
  onCloseGoalModal,
  onSaveGoal,
  onCloseGoalAction,
  onOpenEditGoal,
  onDeleteGoal,
}: MonthlyViewProps) {
  return (
    <>
      <div className="rounded-[28px] border border-gray-200 bg-white px-4 py-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
            aria-label="이전 달"
          >
            ‹
          </button>
          <div className="text-base font-semibold text-gray-900">{monthLabel}</div>
          <button
            type="button"
            onClick={onNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
          {dayLabels.map((day) => (
            <div key={day} className={day === "일" ? "text-red-400" : ""}>
              {day}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-sm">
          {monthGrid.map((cell) => {
            const isSunday = cell.date.getDay() === 0;
            const isSelected =
              cell.date.getFullYear() === currentDate.getFullYear() &&
              cell.date.getMonth() === currentDate.getMonth() &&
              cell.date.getDate() === currentDate.getDate();
            return (
              <div key={cell.id} className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onSelectDate(cell.date)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    isSelected
                      ? "bg-violet-100 text-violet-700"
                      : cell.isToday
                        ? "bg-violet-600 text-white shadow"
                        : cell.isCurrentMonth
                          ? isSunday
                            ? "text-red-500"
                            : "text-gray-900"
                          : "text-gray-300"
                  }`}
                  aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
                >
                  {cell.day}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[22px] border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">월간 목표</div>
          <button
            type="button"
            onClick={onAddGoal}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-200 bg-violet-50 p-0 text-violet-600 shadow-sm"
            aria-label="월간 목표 추가"
          >
            <HiOutlinePlus className="h-4 w-4 text-violet-600" />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {monthGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => onToggleGoalDone(goal.id)}
                className="flex flex-1 items-center gap-2 bg-transparent p-0 text-left text-sm"
                aria-label={`${goal.title} 완료`}
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                    goal.done
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {goal.done && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span
                  className={goal.done ? "text-gray-400 line-through" : "text-gray-700"}
                >
                  {goal.title}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onOpenGoalActions(goal.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-500 shadow-none"
                aria-label={`${goal.title} 관리`}
              >
                <HiOutlineEllipsisHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-2 shadow-md">
        <div className="flex items-center justify-between pt-2 pb-1">
          <div className="text-sm font-semibold text-gray-900">선택 날짜 플래너</div>
          <div className="text-xs font-semibold text-gray-400">{todayLabel}</div>
        </div>
        {subjects.map((subject, index) => {
          const isOpen = openSubjects[subject.id];
          return (
            <div
              key={subject.id}
              className={index === 0 ? "pt-2" : "border-t border-gray-200 pt-3"}
            >
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-900">{subject.name}</span>
                  <button
                    type="button"
                    onClick={() => onAddTask(subject.name)}
                    className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-700 shadow-none"
                    aria-label={`${subject.name} 할 일 추가`}
                  >
                    <HiOutlinePlus className="h-3 w-3 text-gray-700" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleSubject(subject.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent p-0 text-gray-400 shadow-none"
                  aria-label={`${subject.name} 목록 ${isOpen ? "접기" : "펼치기"}`}
                >
                  {isOpen ? (
                    <HiOutlineChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <HiOutlineChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="space-y-2 pb-3">
                  {subject.tasks.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                      할 일이 없습니다.
                    </div>
                  ) : (
                    subject.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <button
                          type="button"
                          onClick={() => onToggleTaskDone(subject.id, task.id)}
                          className="flex items-center gap-2 bg-transparent p-0 text-left"
                          aria-label={`${task.title} 완료`}
                        >
                          <span
                            className={`h-3 w-3 rounded-full border ${
                              task.done
                                ? "border-violet-500 bg-violet-500"
                                : "border-gray-300 bg-white"
                            }`}
                          />
                          <span
                            className={
                              task.done ? "text-gray-400 line-through" : "text-gray-900"
                            }
                          >
                            {task.title}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTaskActions(subject.id, task)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-500 shadow-none"
                          aria-label={`${task.title} 관리`}
                        >
                          <HiOutlineEllipsisHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ModalBase open={goalModalOpen} onClose={onCloseGoalModal}>
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {goalEditId ? "목표 수정" : "월간 목표 추가"}
            </h2>
            <button
              type="button"
              onClick={onCloseGoalModal}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
              aria-label="닫기"
            >
              <HiOutlineXMark className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-gray-700">목표</div>
            <input
              value={goalDraftTitle}
              onChange={(event) => onChangeGoalDraftTitle(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-violet-400 focus:outline-none"
              placeholder="목표를 입력하세요."
            />
          </div>
          <button
            type="button"
            onClick={onSaveGoal}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow"
          >
            저장하기
          </button>
        </div>
      </ModalBase>

      <ModalBase open={goalActionOpen} onClose={onCloseGoalAction}>
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">목표 관리</h2>
            <button
              type="button"
              onClick={onCloseGoalAction}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
              aria-label="닫기"
            >
              <HiOutlineXMark className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onOpenEditGoal}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-4 text-sm font-semibold text-gray-700"
            >
              <HiOutlinePencilSquare className="h-5 w-5 text-blue-500" />
              수정하기
            </button>
            <button
              type="button"
              onClick={onDeleteGoal}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-4 text-sm font-semibold text-gray-700"
            >
              <HiOutlineTrash className="h-5 w-5 text-red-500" />
              삭제하기
            </button>
          </div>
        </div>
      </ModalBase>
    </>
  );
}
