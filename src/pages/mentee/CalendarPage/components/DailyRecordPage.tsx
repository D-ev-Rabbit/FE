import { useEffect, useMemo, useRef, useState } from "react";
import ModalBase from "@/shared/ui/modal/ModalBase";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import { HiOutlineClock } from "react-icons/hi2";
import type { SubjectGroup } from "../types/calendar";
import { menteeStudySessionApi } from "@/api/mentee/studySession";
import type { StudySession } from "@/types/studySession";
import SubjectRecordModal from "./SubjectRecordModal";

type DailyRecordPageProps = {
  todayLabel: string;
  subjects: SubjectGroup[];
  dateKey: string;
  readOnly: boolean;
  onBack: () => void;
  onPrevDate: () => void;
  onNextDate: () => void;
  onOpenDatePicker: () => void;
  onRefreshSessions?: () => void;
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

const SUBJECT_COLOR_BY_NAME: Record<string, (typeof SUBJECT_COLORS)[number]> = {
  국어: SUBJECT_COLORS[0],
  영어: SUBJECT_COLORS[1],
  수학: SUBJECT_COLORS[2],
};

const formatTimeHM = (minutes: number) => {
  const total = Math.max(0, minutes);
  const hours = Math.floor(total / 60);
  const remain = total % 60;
  if (hours === 0) return `${remain}분`;
  if (remain === 0) return `${hours}시간`;
  return `${hours}시간 ${remain}분`;
};

type RecordItem = {
  id: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  sessionId?: number;
};

const formatDurationLabel = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `${hours}h` : `${hours}h ${remain}m`;
};

const toKstDate = (isoString?: string | null) => {
  if (!isoString) return null;
  return new Date(isoString);
};

const formatClockFromIso = (isoString: string) => {
  const date = toKstDate(isoString);
  if (!date || Number.isNaN(date.getTime())) return "00:00:00";
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  const ss = parts.find((p) => p.type === "second")?.value ?? "00";
  return `${hh}:${mm}:${ss}`;
};

const formatLocalDateTime = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
};

const DAY_START_MINUTES = 5 * 60;
const PLANNER_DAY_START_HOUR = 5;

const toDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const addDaysToDateKey = (dateKey: string, amount: number) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + amount);
  return toDateKey(dt);
};

const getNextPlannerBoundary = (date: Date) => {
  const boundary = new Date(date);
  boundary.setHours(PLANNER_DAY_START_HOUR, 0, 0, 0);
  if (date >= boundary) {
    boundary.setDate(boundary.getDate() + 1);
  }
  return boundary;
};

const toPlannerDateKeyFromIso = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const minutes = date.getHours() * 60 + date.getMinutes();
  const baseKey = toDateKey(date);
  return minutes < DAY_START_MINUTES ? addDaysToDateKey(baseKey, -1) : baseKey;
};

const toPlannerBaseDateTime = (dateKey: string) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, PLANNER_DAY_START_HOUR, 0, 0, 0);
};

const addMinutesToDate = (date: Date, minutes: number) => {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
};

const toRecordItem = (session: StudySession): RecordItem | null => {
  if (!session.endAt) return null;
  return {
    id: `session-${session.sessionId}`,
    sessionId: session.sessionId,
    subjectId: session.subject,
    subjectName: session.subject,
    durationMinutes: Math.max(1, Math.ceil(session.durationSeconds / 60)),
    startTime: formatClockFromIso(session.startAt),
    endTime: formatClockFromIso(session.endAt),
  };
};

const toRecordsByDate = (sessions: StudySession[]) =>
  sessions.reduce<Record<string, RecordItem[]>>((acc, session) => {
    const item = toRecordItem(session);
    if (!item) return acc;
    const plannerDateKey = toPlannerDateKeyFromIso(session.startAt) ?? session.date;
    const next = acc[plannerDateKey] ?? [];
    acc[plannerDateKey] = [item, ...next];
    return acc;
  }, {});

const mergeRecordsByDate = (
  prev: Record<string, RecordItem[]>,
  incoming: Record<string, RecordItem[]>
) => {
  const next = { ...prev };
  Object.entries(incoming).forEach(([key, items]) => {
    const current = next[key] ?? [];
    const map = new Map<string, RecordItem>();
    current.forEach((item) => map.set(item.id, item));
    items.forEach((item) => map.set(item.id, item));
    next[key] = Array.from(map.values());
  });
  return next;
};

const parseClockToMinutes = (value: string) => {
  const parts = value.split(":").map(Number);
  if (parts.length < 2) return null;
  const [h, m, s = 0] = parts;
  if ([h, m, s].some((v) => Number.isNaN(v))) return null;
  return h * 60 + m + s / 60;
};

const toTimelineMinutes = (minutes: number) => {
  let value = minutes - DAY_START_MINUTES;
  while (value < 0) value += 1440;
  return value % 1440;
};

const parseHMToMinutes = (value: string) => {
  const parts = value.split(":").map(Number);
  if (parts.length < 2) return null;
  const [h, m] = parts;
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const isOverlap = (startA: number, endA: number, startB: number, endB: number) =>
  startA < endB && startB < endA;

const hasOverlapInRecords = (records: RecordItem[], start: number, end: number) =>
  records.some((record) => {
    const startValue = parseClockToMinutes(record.startTime);
    const endValue = parseClockToMinutes(record.endTime);
    if (startValue === null || endValue === null) return false;
    let s = toTimelineMinutes(startValue);
    let e = toTimelineMinutes(endValue);
    if (e <= s) e += 1440;
    return isOverlap(start, end, s, e);
  });

const calcDurationMinutes = (start: string, end: string) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (Number.isNaN(sh) || Number.isNaN(sm) || Number.isNaN(eh) || Number.isNaN(em)) {
    return 0;
  }
  if (sh === eh && sm === em) return 0;
  const startMinutes = toTimelineMinutes(sh * 60 + sm);
  const endMinutes = toTimelineMinutes(eh * 60 + em);
  const diff = endMinutes - startMinutes;
  return diff > 0 ? diff : diff + 1440;
};

export default function DailyRecordPage({
  todayLabel,
  subjects,
  dateKey,
  readOnly,
  onBack,
  onPrevDate,
  onNextDate,
  onOpenDatePicker,
  onRefreshSessions,
}: DailyRecordPageProps) {
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0]?.id ?? "");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoStart, setAutoStart] = useState<Date | null>(null);
  const [autoElapsedSec, setAutoElapsedSec] = useState(0);
  const [runningSubjectId, setRunningSubjectId] = useState<string | null>(null);
  const [runningSessionId, setRunningSessionId] = useState<number | null>(null);
  const [manualStart, setManualStart] = useState("05:00");
  const [manualEnd, setManualEnd] = useState("05:50");
  const [manualError, setManualError] = useState("");
  const [autoError, setAutoError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [backConfirmOpen, setBackConfirmOpen] = useState(false);
  const [pendingSubjectId, setPendingSubjectId] = useState<string | null>(null);
  const startRequestRef = useRef<ReturnType<typeof menteeStudySessionApi.start> | null>(null);
  const stopRequestRef = useRef(false);
  const [recordsByDate, setRecordsByDate] = useState<Record<string, RecordItem[]>>(
    {}
  );
  const records = recordsByDate[dateKey] ?? [];

  const subjectColorMap = useMemo(() => {
    const map = new Map<string, (typeof SUBJECT_COLORS)[number]>();
    const names = [
      ...subjects.map((subject) => subject.name),
      ...records.map((record) => record.subjectName ?? record.subjectId),
    ];
    const unique = Array.from(new Set(names.filter(Boolean)));
    unique.forEach((name, index) => {
      map.set(
        name,
        SUBJECT_COLOR_BY_NAME[name] ?? SUBJECT_COLORS[index % SUBJECT_COLORS.length]
      );
    });
    return map;
  }, [subjects, records]);

  const subjectTimes = useMemo(() => {
    const runningMinutes = autoRunning ? Math.floor(autoElapsedSec / 60) : 0;
    const runningSeconds = autoRunning ? autoElapsedSec % 60 : 0;
    return subjects.map((subject) => {
      const baseMinutes = records
        .filter((record) => record.subjectId === subject.name)
        .reduce((acc, record) => acc + record.durationMinutes, 0);
      const extra =
        autoRunning && subject.id === runningSubjectId ? runningMinutes : 0;
      const seconds =
        autoRunning && subject.id === runningSubjectId ? runningSeconds : 0;
      return { ...subject, minutes: baseMinutes + extra, seconds };
    });
  }, [subjects, records, autoRunning, autoElapsedSec, runningSubjectId]);

  const totalStudyMinutes = useMemo(
    () => subjectTimes.reduce((acc, cur) => acc + (cur.minutes ?? 0), 0),
    [subjectTimes]
  );

  const groupedRecords = useMemo(() => {
    const order = new Map<string, number>([
      ["국어", 0],
      ["영어", 1],
      ["수학", 2],
    ]);
    let fallbackIndex = 10;
    subjects.forEach((subject) => {
      if (!order.has(subject.id)) {
        order.set(subject.id, fallbackIndex);
        fallbackIndex += 1;
      }
    });

    const map = new Map<string, RecordItem[]>();
    records.forEach((record) => {
      const list = map.get(record.subjectId) ?? [];
      list.push(record);
      map.set(record.subjectId, list);
    });

    const entries = Array.from(map.entries()).map(([subjectId, items]) => ({
      subjectId,
      subjectName: items[0]?.subjectName ?? subjectId,
      items: [...items].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));

    entries.sort((a, b) => {
      const aOrder = order.has(a.subjectId) ? order.get(a.subjectId)! : 9999;
      const bOrder = order.has(b.subjectId) ? order.get(b.subjectId)! : 9999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.subjectName.localeCompare(b.subjectName, "ko-KR");
    });

    return entries;
  }, [records, subjects]);

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

  useEffect(() => {
    if (!dateKey) return;
    const nextDateKey = addDaysToDateKey(dateKey, 1);
    Promise.all([
      menteeStudySessionApi.getByDate(dateKey),
      menteeStudySessionApi.getByDate(nextDateKey),
    ])
      .then(([currentRes, nextRes]) => {
        const sessions = [
          ...(currentRes.data ?? []),
          ...(nextRes.data ?? []),
        ];
        setRecordsByDate((prev) => mergeRecordsByDate(prev, toRecordsByDate(sessions)));
        const running = sessions.find((session) => !session.endAt && session.mode === "AUTO");
        if (running && !autoRunning && !stopRequestRef.current) {
          setRunningSessionId(running.sessionId);
          setRunningSubjectId(running.subject);
          const start = toKstDate(running.startAt);
          setAutoStart(start ?? new Date());
          setAutoRunning(true);
        }
      })
      .catch(() => {
        // keep existing records on error to avoid wiping optimistic entries
      });
  }, [dateKey, autoRunning]);

  const elapsedLabel = useMemo(() => {
    const hours = Math.floor(autoElapsedSec / 3600);
    const minutes = Math.floor((autoElapsedSec % 3600) / 60);
    const seconds = autoElapsedSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [autoElapsedSec]);

  const openRecordModal = (subjectId: string) => {
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
    setRunningSessionId(null);
  };

  const startAuto = (subjectId: string) => {
    if (startRequestRef.current) return;
    stopRequestRef.current = false;
    const now = new Date();
    const subjectName = subjects.find((subject) => subject.id === subjectId)?.name ?? subjectId;
    setRunningSubjectId(subjectId);
    setAutoStart(now);
    setAutoElapsedSec(0);
    setAutoRunning(true);

    const request = menteeStudySessionApi.start({
      subject: subjectName,
      startAt: formatLocalDateTime(now),
    });
    startRequestRef.current = request;
    request
      .then((res) => {
        setRunningSessionId(res.data.sessionId);
      })
      .catch(() => {
        resetAuto();
        startRequestRef.current = null;
      });
  };

  const stopAuto = () => {
    if (!autoStart || !runningSubjectId) {
      resetAuto();
      return;
    }
    stopRequestRef.current = true;
    const end = new Date();
    const subjectName = subjects.find((subject) => subject.id === runningSubjectId)?.name ?? runningSubjectId;
    const boundary = getNextPlannerBoundary(autoStart);
    const shouldSplit = autoStart < boundary && end > boundary;
    const stopEnd = shouldSplit ? boundary : end;
    const manualStart = boundary;
    const manualEnd = end;
    // 기록은 중지 응답에서만 반영하여 중복 생성 방지
    const finalizeStop = (sessionId: number) => {
      menteeStudySessionApi.stop(sessionId, { endAt: formatLocalDateTime(stopEnd) })
        .then((res) => {
          setRecordsByDate((prev) => mergeRecordsByDate(prev, toRecordsByDate(res.data.sessions)));
          if (shouldSplit && manualEnd > manualStart) {
            return menteeStudySessionApi.createManual({
              subject: subjectName,
              startAt: formatLocalDateTime(manualStart),
              endAt: formatLocalDateTime(manualEnd),
            }).then((manualRes) => {
              setRecordsByDate((prev) =>
                mergeRecordsByDate(prev, toRecordsByDate(manualRes.data.sessions))
              );
            });
          }
        })
        .catch(() => {
          // ignore to keep UI responsive
        })
        .finally(() => {
          onRefreshSessions?.();
          startRequestRef.current = null;
          stopRequestRef.current = false;
        });
    };

    if (runningSessionId) {
      finalizeStop(runningSessionId);
    } else if (startRequestRef.current) {
      startRequestRef.current
        .then((res) => finalizeStop(res.data.sessionId))
        .catch(() => {
          stopRequestRef.current = false;
          // ignore
        });
    }
    resetAuto();
  };

  const handleBack = () => {
    if (autoRunning) {
      setBackConfirmOpen(true);
      return;
    }
    onBack();
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

    return segments;
  }, [records, autoRunning, autoStart, runningSubjectId]);

  const handleAutoToggle = () => {
    if (readOnly) {
      setAutoError("자동 기록은 오늘 날짜에서만 사용할 수 있어요.");
      return;
    }
    setAutoError("");
    if (autoRunning) {
      if (runningSubjectId && runningSubjectId !== activeSubjectId) {
        setPendingSubjectId(activeSubjectId);
        setConfirmOpen(true);
        return;
      }
      stopAuto();
      setRecordModalOpen(false);
      return;
    }
    startAuto(activeSubjectId);
    setRecordModalOpen(false);
  };

  const handleSaveManual = () => {
    const duration = calcDurationMinutes(manualStart, manualEnd);
    if (duration === 0 || !activeSubject) {
      setManualError("종료 시간은 시작 시간보다 늦어야 합니다");
      return;
    }
    const newStart = parseHMToMinutes(manualStart);
    const newEnd = parseHMToMinutes(manualEnd);
    if (newStart === null || newEnd === null) {
      setManualError("시간 형식이 올바르지 않습니다");
      return;
    }
    if (newStart >= newEnd) {
      setManualError("종료 시간은 시작 시간보다 늦어야 합니다");
      return;
    }
    const ns = toTimelineMinutes(newStart);
    const ne = toTimelineMinutes(newEnd);
    const isWrapped = ne <= ns;
    const nextDateKey = addDaysToDateKey(dateKey, 1);
    const nextRecords = recordsByDate[nextDateKey] ?? [];
    const hasOverlap =
      (!isWrapped && hasOverlapInRecords(records, ns, ne)) ||
      (isWrapped &&
        (hasOverlapInRecords(records, ns, 1440) ||
          hasOverlapInRecords(nextRecords, 0, ne)));
    if (hasOverlap) {
      setManualError("해당 시간대에 이미 기록이 있어요");
      return;
    }
    setManualError("");
    setAutoError("");
    const baseDate = toPlannerBaseDateTime(dateKey);
    const createManual = (startMinutes: number, endMinutes: number, base: Date) =>
      menteeStudySessionApi.createManual({
        subject: activeSubject.name,
        startAt: formatLocalDateTime(addMinutesToDate(base, startMinutes)),
        endAt: formatLocalDateTime(addMinutesToDate(base, endMinutes)),
      });

    const requests = isWrapped
      ? [
        createManual(ns, 1440, baseDate),
        createManual(0, ne, addMinutesToDate(baseDate, 1440)),
      ]
      : [createManual(ns, ne, baseDate)];

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((res) => {
          setRecordsByDate((prev) => mergeRecordsByDate(prev, toRecordsByDate(res.data.sessions)));
        });
        onRefreshSessions?.();
      })
      .catch(() => {
        setManualError("기록 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      });
    setRecordModalOpen(false);
  };
  const rowHeight = 18;
  const totalRows = 24;
  const hourLabels = Array.from(
    { length: 24 },
    (_, index) => ((DAY_START_MINUTES / 60 + index) % 24)
  );

  return (
    <div className="space-y-6 pb-6 pt-1">
      <div className="relative z-10 flex items-center">
        <button
          type="button"
          onClick={handleBack}
          className="border-0 bg-transparent p-0 text-base font-semibold text-gray-600 outline-none hover:border-0 hover:outline-none focus:outline-none focus-visible:outline-none"
          aria-label="플래너로 돌아가기"
        >
          ←
        </button>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <button
            type="button"
            onClick={onPrevDate}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
            aria-label="전날 이동"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onOpenDatePicker}
            className="whitespace-nowrap border-0 bg-transparent p-0 text-base font-semibold text-gray-900 outline-none hover:border-0 hover:outline-none focus:outline-none focus-visible:outline-none"
            aria-label="날짜 선택"
          >
            {todayLabel}
          </button>
          <button
            type="button"
            onClick={onNextDate}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
            aria-label="다음날 이동"
          >
            ›
          </button>
        </div>
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
              className={`flex min-w-0 items-center justify-center gap-1 rounded-2xl px-1.5 py-1 ${color.bg} ${
                isRunning ? "border-2 border-emerald-400" : ""
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${color.dot}`} />
              <span className={`text-[11px] font-semibold ${color.text} truncate`}>
                {subject.name}
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                {formatTimeHM(subject.minutes)}
              </span>
            </button>
          );
        })}
        {subjectTimes.length === 0 && (
          <div className="text-sm font-semibold text-gray-400">과목이 없습니다.</div>
        )}
      </div>
      {autoRunning && runningSubjectId && (
        <button
          type="button"
          onClick={() => openRecordModal(runningSubjectId)}
          className="flex w-full items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
          aria-label="현재 진행 중 기록 열기"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          현재 진행 중: {subjectTimes.find((s) => s.id === runningSubjectId)?.name ?? runningSubjectId}
          <span className="ml-auto text-emerald-600">{elapsedLabel}</span>
        </button>
      )}

      <div>
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 via-[#F7F8FC] to-[#F1F3F9] p-0 shadow-sm">
          <div className="-ml-2 grid grid-cols-[36px_1fr] gap-1 items-start">
            <div className="flex flex-col">
              <div className="h-4 bg-white/60" />
              <div
                className="grid text-[7px] font-semibold text-gray-400 leading-none bg-white/60"
                style={{
                  gridTemplateRows: `repeat(24, ${rowHeight}px)`,
                  height: totalRows * rowHeight - 1,
                }}
              >
              {hourLabels.map((hour) => (
                <div key={hour} className="flex items-start justify-end pr-1">
                  {String(hour).padStart(2, "0")}
                </div>
              ))}
              </div>
            </div>
            <div className="flex flex-col pr-2">
              <div className="mb-1 grid grid-cols-12 text-[7px] font-semibold text-gray-400 leading-none bg-white/60">
                {Array.from({ length: 12 }, (_, index) => (
                  <div key={index} className="text-right pr-0.5 mt-1 mb-1">
                    {(index + 1) * 5}
                  </div>
                ))}
              </div>
              <div
                className="relative box-border"
                style={{
                  height: totalRows * rowHeight - 1,
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
      </div>

      <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-700">오늘 기록</div>
          <div className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            총 공부시간 {formatTimeHM(totalStudyMinutes)}
          </div>
        </div>
        <div className="mt-3 space-y-3">
          {records.length === 0 && (
            <div className="text-xs font-semibold text-gray-400">
              아직 기록된 시간이 없습니다.
            </div>
          )}
          {groupedRecords.map((group) => {
            const color = subjectColorMap.get(group.subjectId);
            return (
              <div key={group.subjectId} className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-xs font-semibold text-gray-600">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      color?.dot ?? "bg-violet-400"
                    }`}
                  />
                  {group.subjectName}
                </div>
                {group.items.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                          color?.dot ?? "bg-violet-400"
                        } ${color?.text ?? "text-white"}`}
                      >
                        <HiOutlineClock size={15} className="text-white" />
                      </span>
                      <span className="text-gray-400">
                        {formatDurationLabel(record.durationMinutes)} : {record.startTime}-
                        {record.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!record.sessionId) {
                            setRecordsByDate((prev) => ({
                              ...prev,
                              [dateKey]: (prev[dateKey] ?? []).filter((item) => item.id !== record.id),
                            }));
                            onRefreshSessions?.();
                            return;
                          }
                          menteeStudySessionApi
                            .delete(record.sessionId)
                            .then(() => {
                              setRecordsByDate((prev) => ({
                                ...prev,
                                [dateKey]: (prev[dateKey] ?? []).filter(
                                  (item) => item.sessionId !== record.sessionId && item.id !== record.id
                                ),
                              }));
                              onRefreshSessions?.();
                            })
                            .catch(() => {});
                        }}
                        className="rounded-full border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-500"
                        aria-label="기록 삭제"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
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
        autoError={autoError}
        onClose={() => setRecordModalOpen(false)}
        onChangeMode={(nextMode) => {
          setMode(nextMode);
          setManualError("");
          setAutoError("");
        }}
        onToggleAuto={handleAutoToggle}
        onChangeManualStart={(value) => {
          setManualStart(value);
          setManualError("");
          setAutoError("");
        }}
        onChangeManualEnd={(value) => {
          setManualEnd(value);
          setManualError("");
          setAutoError("");
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

      <ConfirmModal
        open={backConfirmOpen}
        variant="info"
        title="기록 중입니다"
        description="기록을 종료하고 돌아갈까요?"
        cancelText="계속 기록"
        confirmText="종료하고 나가기"
        onCancel={() => setBackConfirmOpen(false)}
        onConfirm={() => {
          setBackConfirmOpen(false);
          stopAuto();
          onBack();
        }}
      />
    </div>
  );
}
