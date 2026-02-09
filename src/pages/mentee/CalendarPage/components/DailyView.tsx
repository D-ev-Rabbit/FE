import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineEllipsisHorizontal,
  HiOutlinePlus,
} from "react-icons/hi2";
import type { SubjectGroup } from "../types/calendar";
import { parseStudyMinutes } from "../utils/time";
import { cn } from "@/shared/lib/cn";

type DailyViewProps = {
  todayLabel: string;
  progress: number;
  doneCount: number;
  totalCount: number;
  dailyNoteText: string;
  subjects: SubjectGroup[];
  studyMinutesBySubject: Record<string, number>;
  totalStudyMinutes: number;
  openSubjects: Record<string, boolean>;
  mentorComment?: string;
  onOpenTaskDetail: (taskId: string) => void;

  onPrevDay: () => void;
  onNextDay: () => void;
  onOpenDatePicker: () => void;
  onOpenDailyNote: () => void;
  onGoMonthly: () => void;
  onOpenRecord: () => void;
  onToggleSubject: (id: string) => void;
  onAddTask: (subjectName: string) => void;
  onToggleTaskDone: (subjectId: string, taskId: string) => void;
  onOpenTaskActions: (subjectId: string, task: SubjectGroup["tasks"][number]) => void;
};

export default function DailyView({
  todayLabel,
  progress,
  doneCount,
  totalCount,
  subjects,
  studyMinutesBySubject,
  totalStudyMinutes,
  openSubjects,
  mentorComment,
  onPrevDay,
  onNextDay,
  onOpenDatePicker,
  onOpenRecord,
  onToggleSubject,
  onAddTask,
  onToggleTaskDone,
  onOpenTaskActions,
  onOpenTaskDetail,
}: DailyViewProps) {
  const formatStudyTimeCaps = (minutes: number) => {
    if (minutes <= 0) return "0분";
    const hours = Math.floor(minutes / 60);
    const remain = minutes % 60;
    if (hours === 0) return `${remain}분`;
    if (remain === 0) return `${hours}시간`;
    return `${hours}시간 ${remain}분`;
  };

  const studyTimes = subjects.map((subject) => {
    const minutes =
      studyMinutesBySubject[subject.name] ??
      studyMinutesBySubject[subject.id] ??
      subject.tasks.reduce((acc, task) => acc + parseStudyMinutes(task.time), 0);
    return { id: subject.id, name: subject.name, minutes };
  });

  const subjectCardClass = (name: string) => {
    if (name === "국어") return "bg-yellow-100 text-gray-800 border-yellow-200";
    if (name === "영어") return "bg-rose-100 text-gray-800 border-rose-200";
    if (name === "수학") return "bg-indigo-100 text-gray-800 border-indigo-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="rounded-[26px] border border-gray-200 bg-white px-3 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevDay}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
              aria-label="전날로 이동"
            >
              ‹
            </button>
            <div className="flex flex-1 items-center justify-center gap-2">
              <button
                type="button"
                onClick={onOpenDatePicker}
                className="border-0 bg-white p-0 text-center text-base font-semibold text-gray-900 leading-none outline-none focus:outline-none focus-visible:outline-none"
                aria-label="날짜 선택"
              >
                {todayLabel}
              </button>
            </div>
            <button
              type="button"
              onClick={onNextDay}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
              aria-label="다음날로 이동"
            >
              ›
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div
                className="h-10 w-10 rounded-full"
                style={{
                  background: `conic-gradient(#7C3AED ${progress}%, #E5E7EB 0)`,
                }}
              />
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white text-[10px] font-semibold text-gray-700">
                {doneCount}/{totalCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span>총 공부 시간</span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {formatStudyTimeCaps(totalStudyMinutes)}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenRecord}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700"
          >
            기록하기
          </button>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {studyTimes.map((subject) => (
            <div
              key={subject.id}
              className={`flex min-w-[80px] flex-col items-center justify-center rounded-2xl border px-3 py-2 text-xs font-semibold shadow-sm ${subjectCardClass(
                subject.name
              )}`}
            >
              <span>{subject.name}</span>
              <span className="text-sm">{formatStudyTimeCaps(subject.minutes)}</span>
            </div>
          ))}
          {studyTimes.length === 0 && (
            <div className="text-xs font-semibold text-gray-400">
              아직 기록된 공부 시간이 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-2 shadow-md">
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
                    [...subject.tasks]
                      .sort((a, b) => Number(a.done ?? false) - Number(b.done ?? false))
                      .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
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
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenTaskDetail(String(task.id))}
                            className={cn(
                              "flex items-center gap-2 bg-transparent p-0 text-left",
                              task.done ? "text-gray-400 line-through" : "text-gray-900"
                            )}
                            aria-label={`${task.title} 상세보기`}
                          >
                            {task.title}
                            {task.isMine === false && (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0 text-[9px] font-semibold text-amber-700">
                                멘토
                              </span>
                            )}
                          </button>
                        </div>

                        {task.isMine !== false && (
                          <button
                            type="button"
                            onClick={() => onOpenTaskActions(subject.id, task)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-500 shadow-none"
                            aria-label={`${task.title} 관리`}
                          >
                            <HiOutlineEllipsisHorizontal className="h-4 w-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-6 shadow-sm">
        <div className="text-sm font-semibold text-gray-800">멘토 피드백</div>
        <div className={cn("mt-6 text-sm", mentorComment ? "text-gray-700" : "text-gray-300")}>
          {mentorComment ? mentorComment : "멘토 피드백이 이곳에 표시됩니다."}
        </div>
      </div>
    </>
  );
}
