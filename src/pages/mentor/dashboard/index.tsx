import { FaCheckCircle, FaCommentAlt, FaEye } from "react-icons/fa";
import { SummaryBar } from "./SummaryBar";
import { MetricCard } from "./MetricCard";

const COLORS = {
  submission: "hsl(217, 91%, 60%)",
  feedback: "hsl(160, 60%, 45%)",
  confirmed: "hsl(38, 92%, 50%)",
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
  const {
    total,
    submittedCount,
    feedbackWrittenCount,
    feedbackConfirmedCount,
  } = metrics;

  const confirmedCapped = Math.min(feedbackConfirmedCount, feedbackWrittenCount);

  const summaryItems = [
    {
      label: "과제 제출",
      value: submittedCount,
      max: total,
      color: COLORS.submission,
    },
    {
      label: "피드백 작성",
      value: feedbackWrittenCount,
      max: total,
      color: COLORS.feedback,
    },
    {
      label: "피드백 확인",
      value: confirmedCapped,
      max: feedbackWrittenCount || 1,
      color: COLORS.confirmed,
    },
  ];

  const content = (
    <div className="flex flex-col gap-5">
      <SummaryBar items={summaryItems} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="과제 제출 완료"
          description="멘토가 올린 과제 중 멘티가 제출을 완료한 과제 수"
          value={submittedCount}
          max={total}
          color={COLORS.submission}
          icon={<FaCheckCircle className="h-4 w-4" />}
        />
        <MetricCard
          title="피드백 작성 완료"
          description="제출된 과제에 멘토가 피드백을 작성한 과제 수"
          value={feedbackWrittenCount}
          max={total}
          color={COLORS.feedback}
          icon={<FaCommentAlt className="h-4 w-4" />}
        />
        <MetricCard
          title="피드백 확인"
          description="멘토의 피드백을 멘티가 확인한 과제 수"
          value={confirmedCapped}
          max={feedbackWrittenCount || 0}
          color={COLORS.confirmed}
          icon={<FaEye className="h-4 w-4" />}
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

export { SummaryBar } from "./SummaryBar";
export { MetricCard } from "./MetricCard";
export { ProgressRing } from "./ProgressRing";
