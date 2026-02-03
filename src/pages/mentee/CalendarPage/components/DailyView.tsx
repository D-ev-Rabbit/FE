import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlinePlus,
} from "react-icons/hi2";
import type { SubjectGroup } from "../types/calendar";

type DailyViewProps = {
  todayLabel: string;
  progress: number;
  doneCount: number;
  totalCount: number;
  dailyNoteText: string;

  subjects: SubjectGroup[];
  openSubjects: Record<string, boolean>;

  onPrevDay: () => void;
  onNextDay: () => void;
  onOpenDailyNote: () => void;
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
  dailyNoteText,
  subjects,
  openSubjects,
  onPrevDay,
  onNextDay,
  onOpenDailyNote,
  onToggleSubject,
  onAddTask,
  onToggleTaskDone,
  onOpenTaskActions,
}: DailyViewProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white px-3 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevDay}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
              aria-label="전날로 이동"
            >
              ‹
            </button>
            <div className="flex-1 text-center text-base font-semibold text-gray-900 leading-none">
              {todayLabel}
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

        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-4 shadow-sm">
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

      <div className="relative rounded-3xl border border-gray-200 bg-white px-4 py-6 shadow-sm">
        <button
          type="button"
          onClick={onOpenDailyNote}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-500 shadow-none"
          aria-label="오늘의 한마디 편집"
        >
          <HiOutlinePencil className="h-4 w-4 text-gray-500" />
        </button>
        <div className="flex w-full items-center justify-center px-2 text-sm font-semibold text-gray-500 text-center whitespace-pre-line break-words">
          {dailyNoteText ? dailyNoteText : "오늘의 한마디 / 다짐"}
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

      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-6 shadow-sm">
        <div className="text-sm font-semibold text-gray-800">멘토 피드백</div>
        <div className="mt-6 text-sm text-gray-300">멘토 피드백이 이곳에 표시됩니다.</div>
      </div>
    </>
  );
}
