import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaCheckCircle,
  FaRegClock,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { menteeMeApi } from "@/api/mentee/me";
import type { MenteeSummaryResponse, MenteeSummarySubject } from "@/types/mentee";

type Metric = {
  id: "studyTime" | "taskDone" | "feedbackChecked";
  label: string;
  valueText: string;
  helpText: string;
  icon: React.ReactNode;
};

type SubjectCard = {
  key: string;
  pill: string;
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

  // 바깥 클릭 시 닫기 (버튼/툴팁 내부 클릭은 유지)
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

    // 오른쪽 정렬 느낌 유지 (기존 absolute right-0 느낌)
    let left = r.right - width;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

    // 기본 bottom
    let top = r.bottom + margin;
    let nextPlacement: "top" | "bottom" = "bottom";

    // 실제 tooltip 높이 기반 flip
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
    // open 직후 위치 계산
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

              {/* tail: 기존 스타일 유지, 위/아래만 flip */}
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

export default function ActivitySummaryContent() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);
  const [summary, setSummary] = useState<MenteeSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    menteeMeApi
      .getSummary()
      .then((res) => {
        if (ignore) return;
        setSummary(res.data);
      })
      .catch(() => {
        if (ignore) return;
        setSummary(null);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        로딩 중...
      </div>
    );
  }

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

  const subjectOrder = ["국어", "영어", "수학"];
  const subjectLabel = (name: string) => {
    if (name === "KOREAN") return "국어";
    if (name === "ENGLISH") return "영어";
    if (name === "MATH") return "수학";
    return name;
  };
  const subjectEntries = useMemo(() => {
    const subjects = summary?.subjects ?? {};
    const entries = Object.entries(subjects);
    if (entries.length === 0) {
      return subjectOrder.map((name) => [name, null] as const);
    }
    const ordered = subjectOrder
      .filter((name) => subjects[name])
      .map((name) => [name, subjects[name]] as const);
    const rest = entries
      .filter(([name]) => !subjectOrder.includes(name))
      .map(([name, value]) => [subjectLabel(name), value] as const);
    return [...ordered, ...rest];
  }, [summary]);

  const cards: SubjectCard[] = useMemo(
    () =>
      subjectEntries.map(([name, data]) => {
        const metric = data as MenteeSummarySubject | null;
        return {
          key: name,
          pill: name,
          metrics: [
            {
              id: "studyTime",
              label: "총 학습 시간",
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
              label: "과제 완료율",
              valueText: formatRate(metric?.todoCompletionRate ?? 0),
              helpText: "멘토가 배정한 과제 중 완료 처리된 비율입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <FaCheckCircle size={18} />
                </div>
              ),
            },
            {
              id: "feedbackChecked",
              label: "피드백 확인율",
              valueText: formatRate(metric?.feedbackReadRate ?? 0),
              helpText: "멘토 피드백을 ‘확인함’으로 처리한 비율입니다.",
              icon: (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                  <FaBookOpen size={18} />
                </div>
              ),
            },
          ],
        } as SubjectCard;
      }),
    [subjectEntries]
  );

  useEffect(() => setOpenTooltipId(null), [index]);

  const clamp = (n: number) => Math.max(0, Math.min(cards.length - 1, n));
  const goPrev = () => setIndex((i) => clamp(i - 1));
  const goNext = () => setIndex((i) => clamp(i + 1));

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

  return (
    <div className="mx-auto w-full">
      <div className="relative bg-white rounded-3xl p-2 pb-5 pt-5 shadow-sm border border-gray-100">
        {/* 상단: <  과목탭(인디케이터)  > */}
        <div className="px-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
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
                    onClick={() => setIndex(i)}
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
              disabled={index === cards.length - 1}
              className="btn-none grid h-9 w-9 place-items-center rounded-full text-gray-700 disabled:opacity-40"
              aria-label="다음 과목"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

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
                  className="shrink-0 px-4 pb-6 pt-6"
                  style={{ width: viewportW || "100%" }}
                >
                  <div className="space-y-6">
                    {card.metrics.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-4"
                      >
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

      <div className="mt-2 mr-2 text-right text-xs text-gray-400">
        {summary ? `기간: ${summary.from} ~ ${summary.to}` : "기간: -"}
      </div>

      <div className="px-5 pb-5 pt-3">
        <button
          type="button"
          onClick={() => navigate("/mentee/tasks")}
          className="w-full rounded-2xl border border-violet-400 bg-white px-4 py-2.5 text-sm font-extrabold text-violet-600 hover:bg-violet-500 hover:text-white"
        >
          과제로 이동
        </button>
      </div>
    </div>
  );
}
