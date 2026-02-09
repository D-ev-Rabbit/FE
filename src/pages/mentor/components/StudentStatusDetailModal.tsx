import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  FaBookOpen,
  FaCheckCircle,
  FaRegClock,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import type { MentorMenteeSummary, MentorSummarySubject } from "@/types/mentor";

type Subject = "국어" | "영어" | "수학";

type Props = {
  studentName: string;
  open: boolean;
  onClose: () => void;

  subject?: Subject;
  onPrevSubject?: () => void;
  onNextSubject?: () => void;
  onSelectSubject?: (s: Subject) => void;

  avgStudyTimeText?: string;
  minTaskAchievementRate?: number;
  feedbackResponseRate?: number;
  summary?: MentorMenteeSummary | null;
};

type Metric = {
  id: "studyTime" | "taskDone" | "pendingFeedback" | "feedbackCompleted" | "feedbackChecked";
  label: string;
  valueText: string;
  helpText: string;
  icon: React.ReactNode;
};

type SubjectCard = {
  key: Subject;
  pill: Subject;
  metrics: Metric[];
};

function InfoTooltipPortal({
  id,
  text,
  openId,
  setOpenId,
}: {
  id: string;
  text: string;
  openId: string | null;
  setOpenId: (v: string | null) => void;
}) {
  const isOpen = openId === id;

  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    if (!isOpen) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      const btn = btnRef.current;
      const tip = tipRef.current;

      if (btn?.contains(t)) return;
      if (tip?.contains(t)) return;

      setOpenId(null);
    };

    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("touchstart", onDown, true);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("touchstart", onDown, true);
    };
  }, [isOpen, setOpenId]);

  const recompute = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();
    const margin = 10;
    const width = 256; // w-64

    let left = r.right - width;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

    let top = r.bottom + margin;
    let nextPlacement: "top" | "bottom" = "bottom";

    const tipH = tipRef.current?.offsetHeight ?? 120;
    const spaceBelow = window.innerHeight - (r.bottom + margin);
    const spaceAbove = r.top - margin;

    if (spaceBelow < tipH + 8 && spaceAbove > tipH + 8) {
      nextPlacement = "top";
      top = r.top - margin - tipH;
    }

    setPlacement(nextPlacement);
    setPos({ top: Math.max(8, top), left });
  };

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(recompute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, text]);

  useEffect(() => {
    if (!isOpen) return;

    const onScroll = () => recompute();
    const onResize = () => recompute();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="설명 보기"
        onClick={(e) => {
          e.stopPropagation();
          setOpenId(isOpen ? null : id);
        }}
        className="btn-none grid h-8 w-8 place-items-center rounded-full text-violet-600"
      >
        <FaInfoCircle />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={tipRef}
              initial={{ opacity: 0, y: placement === "bottom" ? 8 : -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: placement === "bottom" ? 8 : -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: 256,
                zIndex: 9999,
              }}
              className="rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="leading-5">{text}</div>
              <div
                className={[
                  "absolute h-2 w-2 rotate-45 bg-white",
                  placement === "bottom"
                    ? "-top-1 right-3 border-l border-t border-gray-200"
                    : "-bottom-1 right-3 border-r border-b border-gray-200",
                ].join(" ")}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default function StudentStatusDetailModal({
  studentName,
  open,
  onClose,
  subject,
  onPrevSubject,
  onNextSubject,
  onSelectSubject,
  avgStudyTimeText = "0M",
  minTaskAchievementRate = 0,
  feedbackResponseRate = 0,
  summary,
}: Props) {
  const [index, setIndex] = useState(0);
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);

  const formatStudyTimeCaps = (seconds: number) => {
    const totalMinutes = Math.max(0, Math.round(seconds / 60));
    const hours = Math.floor(totalMinutes / 60);
    const remain = totalMinutes % 60;
    if (hours === 0) return `${remain}M`;
    if (remain === 0) return `${hours}H`;
    return `${hours}H ${remain}M`;
  };

  const formatRate = (value: number) => {
    const pct = Number.isFinite(value) ? Math.round(value * 100) : 0;
    return `${Math.max(0, Math.min(100, pct))}%`;
  };

  const formatCount = (current: number, total: number) => {
    const c = Number.isFinite(current) ? Math.max(0, current) : 0;
    const t = Number.isFinite(total) ? Math.max(0, total) : 0;
    return `${c}/${t}`;
  };

  const subjectLabel = (key: string): Subject => {
    if (key === "KOREAN") return "국어";
    if (key === "ENGLISH") return "영어";
    if (key === "MATH") return "수학";
    return (key as Subject) ?? "국어";
  };

  const subjectOrder: Subject[] = ["국어", "영어", "수학"];
  const subjectKeyByLabel = (label: Subject) =>
    label === "국어" ? "KOREAN" : label === "영어" ? "ENGLISH" : "MATH";

  const cards: SubjectCard[] = useMemo(() => {
    if (!summary?.subjects) {
      return subjectOrder.map((s) => ({
        key: s,
        pill: s,
        metrics: [
          {
            id: "studyTime",
            label: "설스터디와 함께한 학습 시간",
            valueText: avgStudyTimeText,
            helpText: "해당 과목에서 누적된 학습 시간의 합계입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                <FaRegClock size={18} />
              </div>
            ),
          },
          {
            id: "taskDone",
            label: "멘토가 낸 과제 달성률",
            valueText: `${minTaskAchievementRate}%`,
            helpText: "해당 과목 전체 Todo 중 완료한 비율입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                <FaCheckCircle size={18} />
              </div>
            ),
          },
          {
            id: "pendingFeedback",
            label: "제출 대기 과제",
            valueText: "0/0",
            helpText: "해당 과목에서 제출했지만 아직 피드백이 없는 과제 수입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-600">
                <FaBookOpen size={18} />
              </div>
            ),
          },
          {
            id: "feedbackCompleted",
            label: "피드백 작성 완료",
            valueText: "0/0",
            helpText: "해당 과목에서 피드백이 달려 해결완료된 과제 수입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                <FaCheckCircle size={18} />
              </div>
            ),
          },
          {
            id: "feedbackChecked",
            label: "멘토 피드백 응답률",
            valueText: `${feedbackResponseRate}%`,
            helpText: "멘토 피드백에 대해 멘티가 확인한 비율입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                <FaBookOpen size={18} />
              </div>
            ),
          },
        ],
      }));
    }

    const subjects = summary.subjects;
    const ordered = subjectOrder.map((s) => {
      const raw = subjects[subjectKeyByLabel(s)] ?? subjects[s];
      const metric = raw as MentorSummarySubject | undefined;
      return {
        key: s,
        pill: s,
        metrics: [
          {
            id: "studyTime",
            label: "설스터디와 함께한 학습 시간",
            valueText: formatStudyTimeCaps(metric?.totalStudySeconds ?? 0),
            helpText: "해당 과목에서 누적된 학습 시간의 합계입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                <FaRegClock size={18} />
              </div>
            ),
          },
          {
            id: "taskDone",
            label: "멘토가 낸 과제 달성률",
            valueText: formatRate(metric?.todoCompletionRate ?? 0),
            helpText: "해당 과목 전체 Todo 중 완료한 비율입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                <FaCheckCircle size={18} />
              </div>
            ),
          },
          {
            id: "pendingFeedback",
            label: "제출 대기 과제",
            valueText: formatCount(metric?.pendingFeedbackTodoCount ?? 0, metric?.todoTotal ?? 0),
            helpText: "해당 과목에서 제출했지만 아직 피드백이 없는 과제 수입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-600">
                <FaBookOpen size={18} />
              </div>
            ),
          },
          {
            id: "feedbackCompleted",
            label: "피드백 작성 완료",
            valueText: formatCount(metric?.feedbackCompletedTodoCount ?? 0, metric?.todoTotal ?? 0),
            helpText: "해당 과목에서 피드백이 달려 해결완료된 과제 수입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                <FaCheckCircle size={18} />
              </div>
            ),
          },
          {
            id: "feedbackChecked",
            label: "멘토 피드백 응답률",
            valueText: formatRate(metric?.feedbackReadRate ?? 0),
            helpText: "멘토 피드백에 대해 멘티가 확인한 비율입니다.",
            icon: (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                <FaBookOpen size={18} />
              </div>
            ),
          },
        ],
      } as SubjectCard;
    });

    const rest = Object.entries(subjects)
      .filter(([key]) => {
        const label = subjectLabel(key);
        const keyUpper = key.toUpperCase();
        if (subjectOrder.includes(label)) return false;
        if (keyUpper === "KOREAN" || keyUpper === "ENGLISH" || keyUpper === "MATH") return false;
        return true;
      })
      .map(([key, value]) => {
        const pill = subjectLabel(key);
        const metric = value as MentorSummarySubject;
        return {
          key: pill,
          pill,
          metrics: [
            {
              id: "studyTime",
              label: "설스터디와 함께한 학습 시간",
              valueText: formatStudyTimeCaps(metric?.totalStudySeconds ?? 0),
              helpText: "해당 과목에서 누적된 학습 시간의 합계입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                  <FaRegClock size={18} />
                </div>
              ),
            },
            {
              id: "taskDone",
              label: "멘토가 낸 과제 달성률",
              valueText: formatRate(metric?.todoCompletionRate ?? 0),
              helpText: "해당 과목 전체 Todo 중 완료한 비율입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <FaCheckCircle size={18} />
                </div>
              ),
            },
            {
              id: "pendingFeedback",
              label: "제출 대기 과제",
              valueText: formatCount(metric?.pendingFeedbackTodoCount ?? 0, metric?.todoTotal ?? 0),
              helpText: "해당 과목에서 제출했지만 아직 피드백이 없는 과제 수입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-600">
                  <FaBookOpen size={18} />
                </div>
              ),
            },
            {
              id: "feedbackCompleted",
              label: "피드백 작성 완료",
              valueText: formatCount(metric?.feedbackCompletedTodoCount ?? 0, metric?.todoTotal ?? 0),
              helpText: "해당 과목에서 피드백이 달려 해결완료된 과제 수입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                  <FaCheckCircle size={18} />
                </div>
              ),
            },
            {
              id: "feedbackChecked",
              label: "멘토 피드백 응답률",
              valueText: formatRate(metric?.feedbackReadRate ?? 0),
              helpText: "멘토 피드백에 대해 멘티가 확인한 비율입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                  <FaBookOpen size={18} />
                </div>
              ),
            },
          ],
        } as SubjectCard;
      });

    return [...ordered, ...rest];
  }, [summary, avgStudyTimeText, minTaskAchievementRate, feedbackResponseRate]);

  // 외부 subject prop이 있으면 그걸 우선해서 인덱스 동기화
  useEffect(() => {
    if (!subject) return;
    const i = cards.findIndex((c) => c.key === subject);
    if (i >= 0) setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, cards.length]);

  useEffect(() => setOpenTooltipId(null), [index]);

  const clamp = (n: number) => Math.max(0, Math.min(cards.length - 1, n));
  const goPrevLocal = () => setIndex((i) => clamp(i - 1));
  const goNextLocal = () => setIndex((i) => clamp(i + 1));

  const goPrev = () => {
    setOpenTooltipId(null);
    onPrevSubject ? onPrevSubject() : goPrevLocal();
  };
  const goNext = () => {
    setOpenTooltipId(null);
    onNextSubject ? onNextSubject() : goNextLocal();
  };

  const onSelectTab = (i: number) => {
    setOpenTooltipId(null);
    const s = cards[i].key;
    onSelectSubject ? onSelectSubject(s) : setIndex(i);
  };

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => setViewportW(el.clientWidth);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const SWIPE_THRESHOLD = Math.max(60, viewportW * 0.2);

  if (!open) return null;

  return (
    <div className="w-full max-w-lg">
      <div className="relative rounded-3xl border border-gray-100 bg-white p-2 pb-5 pt-5 shadow-sm">
        {/* 상단: <  과목탭  > */}
        <div className="px-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0 && !onPrevSubject}
              className="btn-none grid h-9 w-9 place-items-center rounded-full text-gray-700 disabled:opacity-40"
              aria-label="이전 과목"
            >
              <FaChevronLeft />
            </button>

            <div className="flex flex-1 items-center justify-center gap-2">
              {cards.map((c, i) => {
                const active = i === index;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => onSelectTab(i)}
                    className={[
                      "rounded-full px-4 py-2 text-xs font-extrabold transition",
                      active
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    ].join(" ")}
                    aria-current={active ? "true" : "false"}
                  >
                    {c.pill}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={index === cards.length - 1 && !onNextSubject}
              className="btn-none grid h-9 w-9 place-items-center rounded-full text-gray-700 disabled:opacity-40"
              aria-label="다음 과목"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* 학생명 */}
        <div className="px-6 pb-2 text-sm text-gray-500">{studentName}</div>

        {/* 스와이프 영역 */}
        <div ref={viewportRef} className="overflow-hidden">
          <motion.div
            className="relative"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragStart={() => setOpenTooltipId(null)}
            onDragEnd={(_, info) => {
              const dx = info.offset.x;
              if (dx > SWIPE_THRESHOLD) goPrev();
              if (dx < -SWIPE_THRESHOLD) goNext();
            }}
          >
            <motion.div
              className="flex"
              animate={{ x: -(index * viewportW) }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              {cards.map((card) => (
                <div
                  key={card.key}
                  className="shrink-0 px-6 pb-6 pt-4"
                  style={{ width: viewportW || "100%" }}
                >
                  <div className="space-y-6">
                    {card.metrics.map((m) => (
                      <div key={m.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {m.icon}
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-gray-500">
                              {m.label}
                            </div>
                            <div className="mt-1 text-base font-extrabold text-gray-900">
                              {m.valueText}
                            </div>
                          </div>
                        </div>

                        <InfoTooltipPortal
                          id={`${card.key}-${m.id}`}
                          text={m.helpText}
                          openId={openTooltipId}
                          setOpenId={setOpenTooltipId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 하단 닫기 */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
