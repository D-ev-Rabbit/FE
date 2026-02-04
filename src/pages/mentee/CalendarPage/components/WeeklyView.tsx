import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineEllipsisHorizontal,
  HiOutlinePlus,
} from "react-icons/hi2";
import type { SubjectGroup, Task } from "../types/calendar";
import { dayLabels, formatMonthLabel } from "../utils/date";
import { formatStudyTime, parseStudyMinutes } from "../utils/time";

const SUBJECT_BADGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  국어: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  영어: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
  수학: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
};

type WeeklyViewProps = {
  weekStart: Date;
  weekDays: Date[];
  currentDate: Date;
  subjects: SubjectGroup[];
  openSubjects: Record<string, boolean>;
  getTasksForDate: (date: Date) => (Task & { subject: string })[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (date: Date) => void;
  onToggleSubject: (id: string) => void;
  onAddTask: (subjectName: string) => void;
  onToggleTaskDone: (subjectId: string, taskId: string) => void;
  onOpenTaskActions: (subjectId: string, task: Task) => void;
  onGoDaily: () => void;
};

export default function WeeklyView({
  weekStart,
  weekDays,
  currentDate,
  subjects,
  openSubjects,
  getTasksForDate,
  onPrevWeek,
  onNextWeek,
  onSelectDate,
  onToggleSubject,
  onAddTask,
  onToggleTaskDone,
  onOpenTaskActions,
  onGoDaily,
}: WeeklyViewProps) {
  const monthLabel = formatMonthLabel(weekStart);
  const weekRangeLabel = `${
    weekStart.getMonth() + 1
  }/${weekStart.getDate()} - ${weekDays[6].getMonth() + 1}/${weekDays[6].getDate()}`;
  const weekTotalMinutes = weekDays.reduce((acc, day) => {
    const minutes = getTasksForDate(day).reduce(
      (sum, task) => sum + parseStudyMinutes(task.time),
      0
    );
    return acc + minutes;
  }, 0);

  return (
    <>
      <div className="rounded-[26px] border border-gray-200 bg-white px-4 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevWeek}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
            aria-label="이전 주차"
          >
            ‹
          </button>
          <div className="text-center">
            <div className="text-base font-semibold text-gray-900">{monthLabel}</div>
          </div>
          <button
            type="button"
            onClick={onNextWeek}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
            aria-label="다음 주차"
          >
            ›
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400">
          {dayLabels.map((day) => (
            <div key={day} className={day === "일" ? "text-red-400" : ""}>
              {day}
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day) => {
            const isToday =
              day.getFullYear() === new Date().getFullYear() &&
              day.getMonth() === new Date().getMonth() &&
              day.getDate() === new Date().getDate();
            const isSelected =
              day.getFullYear() === currentDate.getFullYear() &&
              day.getMonth() === currentDate.getMonth() &&
              day.getDate() === currentDate.getDate();
            const dayTasks = getTasksForDate(day).filter((task) => !task.done);
            const subjectCounts = dayTasks.reduce<Record<string, number>>((acc, task) => {
              const key = task.subject ?? "과목";
              acc[key] = (acc[key] ?? 0) + 1;
              return acc;
            }, {});
            const subjectEntries = Object.entries(subjectCounts);
            return (
              <div key={`${day.getMonth()}-${day.getDate()}`} className="space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectDate(day)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected
                      ? "bg-violet-100 text-violet-700"
                      : isToday
                        ? "bg-violet-600 text-white"
                        : "text-gray-700"
                  }`}
                  aria-label={`${day.getMonth() + 1}월 ${day.getDate()}일`}
                >
                  {day.getDate()}
                </button>
                {subjectEntries.length > 0 && (
                  <div className="flex w-full justify-center">
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
          <div className="text-xs font-semibold text-gray-400">
            {monthLabel} · {weekRangeLabel}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            총 공부시간 {formatStudyTime(weekTotalMinutes)}
          </div>
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
                  <span className="text-base font-semibold text-gray-900">
                    {subject.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {subject.tasks.length}개
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
    </>
  );
}
