"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaCommentAlt, FaEye } from "react-icons/fa";
import { MetricInfoCard } from "./MetricInfoCard";

const COLORS = {
  notSubmitted: "hsl(220, 10%, 82%)",
  waitingFeedback: "hsl(217, 91%, 60%)",
  feedbackWritten: "hsl(160, 60%, 45%)",
  feedbackConfirmed: "hsl(45, 93%, 52%)",
};

export type MentorDashboardMetrics = {
  total: number;
  submittedCount: number;
  feedbackWrittenCount: number;
  feedbackConfirmedCount: number;
};

type MentorDashboardProps = {
  metrics: MentorDashboardMetrics;
  onClick?: () => void;
  className?: string;
};

export function MentorDashboard({ metrics, onClick, className }: MentorDashboardProps) {
  const [animated, setAnimated] = useState(false);
  const {
    total,
    submittedCount: submitted,
    feedbackWrittenCount: feedbackWritten,
    feedbackConfirmedCount: feedbackConfirmed,
  } = metrics;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const confirmedCapped = Math.min(feedbackConfirmed, feedbackWritten);

  const notSubmittedPct = total > 0 ? ((total - submitted) / total) * 100 : 0;
  const feedbackWrittenPct = total > 0 ? (feedbackWritten / total) * 100 : 0;
  const confirmedInsideGreenPct =
    feedbackWritten > 0 ? (confirmedCapped / feedbackWritten) * 100 : 0;
  const overallPct = total > 0 ? Math.round((submitted / total) * 100) : 0;

  const legendItems = [
    { color: COLORS.notSubmitted, label: "미제출", count: `${total - submitted}/${total}` },
    {
      color: COLORS.waitingFeedback,
      label: "제출 · 피드백 대기",
      count: `${submitted - feedbackWritten}/${total}`,
    },
    {
      color: COLORS.feedbackWritten,
      label: "피드백 작성 완료",
      count: `${feedbackWritten}/${total}`,
    },
    {
      color: COLORS.feedbackConfirmed,
      label: "피드백 확인",
      count: `${confirmedCapped}/${feedbackWritten}`,
    },
  ];

  const content = (
    <div className="flex flex-col gap-5">
      {/* ── Summary Bar Section (전체 수행률) ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              전체 수행률
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
              {overallPct}
              <span className="text-base font-medium text-gray-500"> %</span>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            제출 완료 <span className="font-semibold text-gray-900">{submitted}</span> / 전체{" "}
            {total}
          </p>
        </div>

        {/* Stacked Bar: 파란(제출~) → 초록(피드백 작성) → 초록 안에 노란(피드백 확인) */}
        <div className="relative mb-5 h-5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
            style={{
              width: animated ? `${100 - notSubmittedPct}%` : "0%",
              backgroundColor: COLORS.waitingFeedback,
              borderRadius: "9999px",
            }}
          />
          <div
            className="absolute left-0 top-0 h-full overflow-hidden transition-all duration-1000 ease-out"
            style={{
              width: animated ? `${feedbackWrittenPct}%` : "0%",
              backgroundColor: COLORS.feedbackWritten,
              borderRadius: "9999px",
              transitionDelay: "200ms",
            }}
          >
            <div
              className="absolute left-0 top-0 h-full transition-all duration-700 ease-out"
              style={{
                width: animated ? `${confirmedInsideGreenPct}%` : "0%",
                backgroundColor: COLORS.feedbackConfirmed,
                borderRadius: "9999px",
                transitionDelay: "600ms",
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-500">
                {item.label}{" "}
                <span className="font-semibold text-gray-900">({item.count})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 Metric Cards (가로 막대 카드) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricInfoCard
          icon={<FaCheckCircle className="h-5 w-5" style={{ color: COLORS.waitingFeedback }} />}
          iconBg={`${COLORS.waitingFeedback}18`}
          title="과제 제출 완료"
          value={submitted}
          max={total}
          pct={total > 0 ? Math.round((submitted / total) * 100) : 0}
          accentColor={COLORS.waitingFeedback}
          description="멘토가 올린 과제 중 멘티가 제출을 완료한 과제"
        />
        <MetricInfoCard
          icon={<FaCommentAlt className="h-5 w-5" style={{ color: COLORS.feedbackWritten }} />}
          iconBg={`${COLORS.feedbackWritten}18`}
          title="피드백 작성 완료"
          value={feedbackWritten}
          max={total}
          pct={total > 0 ? Math.round((feedbackWritten / total) * 100) : 0}
          accentColor={COLORS.feedbackWritten}
          description="제출된 과제에 멘토가 피드백을 작성한 과제"
        />
        <MetricInfoCard
          icon={<FaEye className="h-5 w-5" style={{ color: COLORS.feedbackConfirmed }} />}
          iconBg={`${COLORS.feedbackConfirmed}18`}
          title="피드백 확인"
          value={confirmedCapped}
          max={feedbackWritten}
          pct={
            feedbackWritten > 0
              ? Math.round((confirmedCapped / feedbackWritten) * 100)
              : 0
          }
          accentColor={COLORS.feedbackConfirmed}
          description="멘토의 피드백을 멘티가 확인 (초록 구간 내 노란색)"
          subBar
          subBarBg={COLORS.feedbackWritten}
        />
      </div>

      {onClick && (
        <p className="text-center text-xs text-gray-500">
          * 각 카드를 클릭하면 자세한 정보를 볼 수 있습니다.
        </p>
      )}
    </div>
  );

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        className={
          className
            ? `cursor-pointer transition hover:opacity-95 ${className}`
            : "cursor-pointer transition hover:opacity-95"
        }
      >
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}

export { MetricInfoCard } from "./MetricInfoCard";
export { SummaryBar } from "./SummaryBar";
export { MetricCard } from "./MetricCard";
export { ProgressRing } from "./ProgressRing";
