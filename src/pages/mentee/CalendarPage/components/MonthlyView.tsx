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
import { parseStudyMinutes } from "../utils/time";

const SUBJECT_BADGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  국어: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  영어: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
  수학: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
};

type MonthlyViewProps = {
  monthLabel: string;
  monthGrid: MonthCell[];
  currentDate: Date;
  todayLabel: string;
  monthGoals: MonthGoal[];
  subjects: SubjectGroup[];
  studyMinutesBySubject: Record<string, number>;
  totalStudyMinutes: number;
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
  getTasksForDate: (date: Date) => Array<Task & { subject?: string }>;
  onGoDaily: () => void;
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
  studyMinutesBySubject,
  totalStudyMinutes,
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
  getTasksForDate,
  onGoDaily,
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
  const formatStudyTimeCaps = (minutes: number) => {
    if (minutes <= 0) return "0M";
    const hours = Math.floor(minutes / 60);
    const remain = minutes % 60;
    if (hours === 0) return `${remain}M`;
    if (remain === 0) return `${hours}H`;
    return `${hours}H ${remain}M`;
  };

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

        <div className="mt-3 grid grid-cols-7 gap-y-3 text-center text-sm">
          {monthGrid.map((cell) => {
            const isSunday = cell.date.getDay() === 0;
            const isSelected =
              cell.date.getFullYear() === currentDate.getFullYear() &&
              cell.date.getMonth() === currentDate.getMonth() &&
              cell.date.getDate() === currentDate.getDate();
            const tasks = cell.isCurrentMonth ? getTasksForDate(cell.date) : [];
            const subjectCounts = tasks.reduce<Record<string, number>>((acc, task) => {
              const key = task.subject ?? "과목";
              acc[key] = (acc[key] ?? 0) + 1;
              return acc;
            }, {});
            const subjectEntries = Object.entries(subjectCounts);
            const isHidden = !cell.isCurrentMonth;
            return (
              <div key={cell.id} className="flex flex-col items-center justify-start">
                {isHidden ? (
                  <div className="h-9 w-9" />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectDate(cell.date)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      isSelected
                        ? "bg-violet-100 text-violet-700"
                        : cell.isToday
                          ? "bg-violet-600 text-white shadow"
                          : isSunday
                            ? "text-red-500"
                            : "text-gray-900"
                    }`}
                    aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
                  >
                    {cell.day}
                  </button>
                )}
                {!isHidden && subjectEntries.length > 0 && (
                  <div className="mt-1 flex w-full justify-center px-0.5">
                    <div className="flex flex-col gap-0.5 text-left text-[9px] font-semibold leading-tight">
                      {subjectEntries.map(([subject, count]) => (
                        <div
                          key={subject}
                          className={`flex items-center gap-1 rounded-md border px-1 py-0 ${
                            SUBJECT_BADGE_STYLES[subject]?.bg ?? "bg-gray-100"
                          } ${SUBJECT_BADGE_STYLES[subject]?.text ?? "text-gray-600"} ${
                            SUBJECT_BADGE_STYLES[subject]?.border ?? "border-gray-200"
                          }`}
                        >
                          <span className="truncate">{subject}</span>
                          <span className="text-[8px]">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-2 shadow-md">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 pt-2 pb-2">
          <div className="text-xs font-semibold text-gray-400">{todayLabel}</div>
          <div className="text-sm font-semibold text-gray-900">
            총 공부시간 {formatStudyTimeCaps(totalStudyMinutes)}
          </div>
        </div>
        {subjects.map((subject, index) => {
          const isOpen = openSubjects[subject.id];
          const studyMinutes =
            studyMinutesBySubject[subject.name] ??
            studyMinutesBySubject[subject.id] ??
            subject.tasks.reduce((sum, task) => sum + parseStudyMinutes(task.time), 0);
          return (
            <div
              key={subject.id}
              className={index === 0 ? "pt-2" : "border-t border-gray-200 pt-3"}
            >
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-900">
                    {subject.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {subject.tasks.length}개 · {formatStudyTimeCaps(studyMinutes)}
                  </span>
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
        <button
          type="button"
          onClick={onGoDaily}
          className="mt-3 ml-auto block w-fit border-0 bg-transparent px-0 py-0 text-xs font-medium text-gray-500"
        >
          일일 플래너로 이동 →
        </button>
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
