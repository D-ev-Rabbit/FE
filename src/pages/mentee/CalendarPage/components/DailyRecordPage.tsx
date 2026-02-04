import { useEffect, useMemo, useState } from "react";
import ModalBase from "@/shared/ui/modal/ModalBase";
import { HiOutlineChevronDown, HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import type { SubjectGroup } from "../types/calendar";
import { parseStudyMinutes } from "../utils/time";
import SubjectRecordModal from "./SubjectRecordModal";

type DailyRecordPageProps = {
  todayLabel: string;
  subjects: SubjectGroup[];
  dateKey: string;
  readOnly: boolean;
  onBack: () => void;
  onOpenDatePicker: () => void;
};

const SUBJECT_COLORS = [
  {
    bg: "bg-yellow-100",
    dot: "bg-yellow-400",
    text: "text-gray-800",
    fill: "bg-yellow-300/70",
  },
  {
    bg: "bg-rose-100",
    dot: "bg-rose-500",
    text: "text-gray-800",
    fill: "bg-rose-300/70",
  },
  {
    bg: "bg-indigo-100",
    dot: "bg-indigo-500",
    text: "text-gray-800",
    fill: "bg-indigo-300/70",
  },
  {
    bg: "bg-emerald-100",
    dot: "bg-emerald-500",
    text: "text-gray-800",
    fill: "bg-emerald-300/70",
  },
];

const formatTimeHHMMSS = (minutes: number, seconds = 0) => {
  const total = Math.max(0, minutes);
  const hours = Math.floor(total / 60);
  const remain = total % 60;
  const safeSeconds = Math.max(0, Math.min(59, seconds));
  return `${String(hours).padStart(2, "0")}:${String(remain).padStart(
    2,
    "0"
  )}:${String(safeSeconds).padStart(2, "0")}`;
};

type RecordItem = {
  id: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
};

const formatDurationLabel = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `${hours}h` : `${hours}h ${remain}m`;
};

const formatClock = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    2,
    "0"
  )}:${String(date.getSeconds()).padStart(2, "0")}`;

const parseClockToMinutes = (value: string) => {
  const parts = value.split(":").map(Number);
  if (parts.length < 2) return null;
  const [h, m, s = 0] = parts;
  if ([h, m, s].some((v) => Number.isNaN(v))) return null;
  return h * 60 + m + s / 60;
};

const toTimelineMinutes = (minutes: number) => {
  let value = minutes - 300;
  while (value < 0) value += 1440;
  return value;
};

const calcDurationMinutes = (start: string, end: string) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (Number.isNaN(sh) || Number.isNaN(sm) || Number.isNaN(eh) || Number.isNaN(em)) {
    return 0;
  }
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  const diff = endMinutes - startMinutes;
  return diff > 0 ? diff : 0;
};

export default function DailyRecordPage({
  todayLabel,
  subjects,
  dateKey,
  readOnly,
  onBack,
  onOpenDatePicker,
}: DailyRecordPageProps) {
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0]?.id ?? "");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoStart, setAutoStart] = useState<Date | null>(null);
  const [autoElapsedSec, setAutoElapsedSec] = useState(0);
  const [runningSubjectId, setRunningSubjectId] = useState<string | null>(null);
  const [manualStart, setManualStart] = useState("09:00");
  const [manualEnd, setManualEnd] = useState("09:50");
  const [manualError, setManualError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSubjectId, setPendingSubjectId] = useState<string | null>(null);
  const [recordsByDate, setRecordsByDate] = useState<Record<string, RecordItem[]>>(
    {}
  );
  const records = recordsByDate[dateKey] ?? [];

  const subjectColorMap = useMemo(() => {
    const map = new Map<string, (typeof SUBJECT_COLORS)[number]>();
    subjects.forEach((subject, index) => {
      map.set(subject.id, SUBJECT_COLORS[index % SUBJECT_COLORS.length]);
    });
    return map;
  }, [subjects]);

  const subjectTimes = useMemo(() => {
    const runningMinutes = autoRunning ? Math.floor(autoElapsedSec / 60) : 0;
    const runningSeconds = autoRunning ? autoElapsedSec % 60 : 0;
    return subjects.map((subject) => {
      const baseMinutes = subject.tasks.reduce(
        (acc, task) => acc + parseStudyMinutes(task.time),
        0
      );
      const extra =
        autoRunning && subject.id === runningSubjectId ? runningMinutes : 0;
      const seconds =
        autoRunning && subject.id === runningSubjectId ? runningSeconds : 0;
      return { ...subject, minutes: baseMinutes + extra, seconds };
    });
  }, [subjects, autoRunning, autoElapsedSec, runningSubjectId]);

  const activeSubject = subjectTimes.find((subject) => subject.id === activeSubjectId);
  const activeName = activeSubject?.name ?? "과목";

  useEffect(() => {
    if (!autoRunning || !autoStart) return;
    const id = window.setInterval(() => {
      const diff = Math.floor((Date.now() - autoStart.getTime()) / 1000);
      setAutoElapsedSec(diff);
    }, 1000);
    return () => window.clearInterval(id);
  }, [autoRunning, autoStart]);

  useEffect(() => {
    if (!subjects.find((subject) => subject.id === activeSubjectId)) {
      setActiveSubjectId(subjects[0]?.id ?? "");
    }
  }, [subjects, activeSubjectId]);

  const elapsedLabel = useMemo(() => {
    const hours = Math.floor(autoElapsedSec / 3600);
    const minutes = Math.floor((autoElapsedSec % 3600) / 60);
    const seconds = autoElapsedSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [autoElapsedSec]);

  const openRecordModal = (subjectId: string) => {
    if (readOnly) return;
    if (autoRunning && runningSubjectId && subjectId !== runningSubjectId) {
      setPendingSubjectId(subjectId);
      setConfirmOpen(true);
      return;
    }
    setActiveSubjectId(subjectId);
    setRecordModalOpen(true);
  };

  const resetAuto = () => {
    setAutoRunning(false);
    setAutoStart(null);
    setAutoElapsedSec(0);
    setRunningSubjectId(null);
  };

  const startAuto = (subjectId: string) => {
    setRunningSubjectId(subjectId);
    setAutoStart(new Date());
    setAutoElapsedSec(0);
    setAutoRunning(true);
  };

  const stopAuto = () => {
    if (!autoStart || !runningSubjectId) {
      resetAuto();
      return;
    }
    const end = new Date();
    const durationSeconds = Math.floor((end.getTime() - autoStart.getTime()) / 1000);
    const durationMinutes = Math.max(1, Math.ceil(durationSeconds / 60));
    const startLabel = formatClock(autoStart);
    const endLabel = formatClock(end);
    const runningSubject = subjectTimes.find(
      (subject) => subject.id === runningSubjectId
    );
    if (durationSeconds > 0 && runningSubject) {
      setRecordsByDate((prev) => {
        const next = prev[dateKey] ?? [];
        return {
          ...prev,
          [dateKey]: [
            {
              id: `record-${Date.now()}`,
              subjectId: runningSubject.id,
              subjectName: runningSubject.name,
              durationMinutes,
              startTime: startLabel,
              endTime: endLabel,
            },
            ...next,
          ],
        };
      });
    }
    resetAuto();
  };

  const handleConfirmSwitch = () => {
    if (pendingSubjectId) {
      stopAuto();
      setActiveSubjectId(pendingSubjectId);
      setRecordModalOpen(true);
    }
    setPendingSubjectId(null);
    setConfirmOpen(false);
  };

  const timetableSegments = useMemo(() => {
    const segments: Array<{
      id: string;
      subjectId: string;
      startMinute: number;
      duration: number;
    }> = [];

    const addSegment = (subjectId: string, startMinute: number, duration: number, key: string) =>
      segments.push({ id: key, subjectId, startMinute, duration });

    records.forEach((record) => {
      const startValue = parseClockToMinutes(record.startTime);
      const endValue = parseClockToMinutes(record.endTime);
      if (startValue === null || endValue === null) return;
      let start = startValue;
      let end = endValue;
      if (end <= start) {
        end += 1440;
      }
      let cursor = toTimelineMinutes(start);
      let endCursor = toTimelineMinutes(end);
      if (endCursor <= cursor) {
        endCursor += 1440;
      }

      while (cursor < endCursor) {
        const hourStart = Math.floor(cursor / 60) * 60;
        const hourEnd = hourStart + 60;
        const segmentEnd = Math.min(endCursor, hourEnd);
        const displayStart = cursor % 1440;
        if (displayStart < 1440) {
          addSegment(
            record.subjectId,
            displayStart,
            segmentEnd - cursor,
            `${record.id}-${cursor}`
          );
        }
        cursor = segmentEnd;
      }
    });

    if (autoRunning && autoStart && runningSubjectId) {
      const now = new Date();
      const start =
        autoStart.getHours() * 60 +
        autoStart.getMinutes() +
        autoStart.getSeconds() / 60;
      const end =
        now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      let startValue = start;
      let endValue = end;
      if (endValue <= startValue) {
        endValue += 1440;
      }
      let cursor = toTimelineMinutes(startValue);
      let endCursor = toTimelineMinutes(endValue);
      if (endCursor <= cursor) {
        endCursor += 1440;
      }
      while (cursor < endCursor) {
        const hourStart = Math.floor(cursor / 60) * 60;
        const hourEnd = hourStart + 60;
        const segmentEnd = Math.min(endCursor, hourEnd);
        const displayStart = cursor % 1440;
        if (displayStart < 1440) {
          addSegment(
            runningSubjectId,
            displayStart,
            segmentEnd - cursor,
            `running-${cursor}`
          );
        }
        cursor = segmentEnd;
      }
    }

    return segments;
  }, [records, autoRunning, autoStart, runningSubjectId]);

  const handleAutoToggle = () => {
    if (readOnly) return;
    if (autoRunning) {
      if (runningSubjectId && runningSubjectId !== activeSubjectId) {
        setPendingSubjectId(activeSubjectId);
        setConfirmOpen(true);
        return;
      }
      stopAuto();
      return;
    }
    startAuto(activeSubjectId);
    setRecordModalOpen(false);
  };

  const handleSaveManual = () => {
    if (readOnly) return;
    const duration = calcDurationMinutes(manualStart, manualEnd);
    if (duration === 0 || !activeSubject) {
      setManualError("종료 시간은 시작 시간보다 늦어야 합니다");
      return;
    }
    setManualError("");
    setRecordsByDate((prev) => {
      const next = prev[dateKey] ?? [];
      return {
        ...prev,
        [dateKey]: [
          {
            id: `record-${Date.now()}`,
            subjectId: activeSubject.id,
            subjectName: activeSubject.name,
            durationMinutes: duration,
            startTime: manualStart,
            endTime: manualEnd,
          },
          ...next,
        ],
      };
    });
    setRecordModalOpen(false);
  };
  const rowHeight = 18;
  const totalRows = 24;
  const hourLabels = Array.from({ length: 24 }, (_, index) => (index + 5) % 24);

  return (
    <div className="space-y-6 pb-6 pt-1">
      <div className="relative z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
          aria-label="뒤로가기"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onOpenDatePicker}
          className="flex items-center gap-1 text-base font-semibold text-gray-900"
          aria-label="날짜 선택"
        >
          {todayLabel}
          <HiOutlineChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {subjectTimes.map((subject, index) => {
          const color = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
          const isRunning = autoRunning && subject.id === runningSubjectId;
          return (
            <button
              type="button"
              key={subject.id}
              onClick={() => openRecordModal(subject.id)}
              disabled={readOnly}
              className={`flex min-w-0 items-center justify-center gap-1 rounded-2xl px-1.5 py-1 ${color.bg} ${
                isRunning ? "border-2 border-emerald-400" : ""
              } ${readOnly ? "opacity-50" : ""}`}
            >
              <span className={`h-2 w-2 rounded-full ${color.dot}`} />
              <span className={`text-[11px] font-semibold ${color.text} truncate`}>
                {subject.name}
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                {formatTimeHHMMSS(subject.minutes, subject.seconds)}
              </span>
            </button>
          );
        })}
        {subjectTimes.length === 0 && (
          <div className="text-sm font-semibold text-gray-400">과목이 없습니다.</div>
        )}
      </div>

      <div>
        <div className="mt-3 overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 via-[#F7F8FC] to-[#F1F3F9] p-0 shadow-sm">
          <div className="-ml-2 grid grid-cols-[36px_1fr] gap-1 items-start">
            <div
              className="grid text-[7px] font-semibold text-gray-400 leading-none bg-white/50"
              style={{ gridTemplateRows: `repeat(24, ${rowHeight}px)` }}
            >
              {hourLabels.map((hour) => (
                <div key={hour} className="flex items-start justify-end pr-1">
                  {String(hour).padStart(2, "0")}
                </div>
              ))}
            </div>
            <div
              className="relative box-border"
              style={{
                height: totalRows * rowHeight,
                padding: "1px",
                backgroundColor: "transparent",
                backgroundImage:
                  "linear-gradient(to right, rgba(214,219,232,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(214,219,232,0.55) 1px, transparent 1px)",
                backgroundSize: `calc(100% / 12) 100%, 100% ${rowHeight}px`,
                backgroundPosition: "-1px -1px, -1px -1px",
                backgroundOrigin: "content-box",
                backgroundClip: "content-box",
              }}
            >
              {timetableSegments.map((segment) => {
                const color = subjectColorMap.get(segment.subjectId);
                const hourIndex = Math.floor(segment.startMinute / 60);
                const minuteOffset = segment.startMinute % 60;
                const top = hourIndex * rowHeight;
                const height = rowHeight;
                const left = (minuteOffset / 60) * 100;
                const width = (segment.duration / 60) * 100;
                return (
                  <div
                    key={segment.id}
                    className={`absolute rounded-sm ${color?.fill ?? "bg-violet-300/70"}`}
                    style={{
                      top,
                      left: `${left}%`,
                      width: `${width}%`,
                      height,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
        <div className="text-sm font-semibold text-gray-700">오늘 기록</div>
        {readOnly && (
          <div className="mt-2 text-xs font-semibold text-gray-400">
            오늘 날짜에서만 기록할 수 있어요.
          </div>
        )}
        <div className="mt-3 space-y-2">
          {records.length === 0 && (
            <div className="text-xs font-semibold text-gray-400">
              아직 기록된 시간이 없습니다.
            </div>
          )}
          {records.map((record) => {
            const color = subjectColorMap.get(record.subjectId);
            return (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-5 w-5 rounded-full text-center text-[10px] font-semibold ${
                    color?.fill ?? "bg-violet-200/70"
                  } text-violet-700`}
                >
                  +
                </span>
                <span className="font-semibold text-gray-700">
                  {record.subjectName}
                </span>
                <span className="text-gray-400">
                  {formatDurationLabel(record.durationMinutes)} : {record.startTime}-
                  {record.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRecordsByDate((prev) => ({
                      ...prev,
                      [dateKey]: (prev[dateKey] ?? []).filter((item) => item.id !== record.id),
                    }))
                  }
                  disabled={readOnly}
                  className="rounded-full border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-500"
                  aria-label="기록 삭제"
                >
                  삭제
                </button>
              </div>
            </div>
          )})}
        </div>
      </div>

      <SubjectRecordModal
        open={recordModalOpen}
        subjectName={activeName}
        mode={mode}
        autoRunning={autoRunning}
        elapsedLabel={elapsedLabel}
        manualStart={manualStart}
        manualEnd={manualEnd}
        manualError={manualError}
        onClose={() => setRecordModalOpen(false)}
        onChangeMode={(nextMode) => {
          setMode(nextMode);
          setManualError("");
        }}
        onToggleAuto={handleAutoToggle}
        onChangeManualStart={(value) => {
          setManualStart(value);
          setManualError("");
        }}
        onChangeManualEnd={(value) => {
          setManualEnd(value);
          setManualError("");
        }}
        onSaveManual={handleSaveManual}
      />

      <ModalBase open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="w-full max-w-xs rounded-2xl bg-white px-5 py-4 shadow-xl">
          <div className="text-sm font-semibold text-gray-800">
            현재 시간이 흐르는 과목을 중지할까요?
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-500"
            >
              아니오
            </button>
            <button
              type="button"
              onClick={handleConfirmSwitch}
              className="flex-1 rounded-xl bg-violet-500 px-3 py-2 text-sm font-semibold text-white"
            >
              중지하고 이동
            </button>
          </div>
        </div>
      </ModalBase>
    </div>
  );
}
