import clsx from "clsx";
import { FaCheckCircle, FaCommentAlt, FaEye } from "react-icons/fa";

export type MentorStatusDashboardProps = {
  /** 전체 Todo 수 (멘토+멘티 생성 모두) */
  total: number;
  /** 제출 완료 과제 수 (멘티가 파일 1개 이상 올린 과제) */
  submittedCount: number;
  /** 피드백 작성 완료 과제 수 */
  feedbackWrittenCount: number;
  /** 피드백 확인한 과제 수 (피드백 작성된 것 중 멘티가 확인한 수) */
  feedbackConfirmedCount: number;
  studentName?: string;
  onClick?: () => void;
  className?: string;
};

function SegmentBar({
  total,
  notSubmitted,
  submittedNoFeedback,
  feedbackWritten,
  feedbackConfirmed,
}: {
  total: number;
  notSubmitted: number;
  submittedNoFeedback: number;
  feedbackWritten: number;
  feedbackConfirmed: number;
}) {
  if (total <= 0) {
    return (
      <div className="h-3 w-full rounded-full bg-gray-100">
        <div className="h-3 rounded-full bg-gray-300" style={{ width: "0%" }} />
      </div>
    );
  }

  const pctNot = (notSubmitted / total) * 100;
  const pctNoFb = (submittedNoFeedback / total) * 100;
  const pctFb = (feedbackWritten / total) * 100;
  const pctConfirmedInGreen = feedbackWritten > 0 ? (feedbackConfirmed / feedbackWritten) * 100 : 0;

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
      {/* 회색: 미제출 */}
      <div
        className="h-full shrink-0 bg-gray-300 transition-all"
        style={{ width: `${pctNot}%` }}
      />
      {/* 파란: 제출했지만 피드백 없음 */}
      <div
        className="h-full shrink-0 bg-blue-400 transition-all"
        style={{ width: `${pctNoFb}%` }}
      />
      {/* 초록: 피드백 작성 완료 (그 안에 노란 오버레이 = 확인) */}
      <div
        className="relative h-full shrink-0 bg-emerald-500 transition-all"
        style={{ width: `${pctFb}%` }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-amber-400 transition-all"
          style={{ width: `${pctConfirmedInGreen}%` }}
          title="피드백 확인"
        />
      </div>
    </div>
  );
}

export default function MentorStatusDashboard({
  total,
  submittedCount,
  feedbackWrittenCount,
  feedbackConfirmedCount,
  onClick,
  className,
}: MentorStatusDashboardProps) {
  const notSubmitted = Math.max(0, total - submittedCount);
  const submittedNoFeedback = Math.max(0, submittedCount - feedbackWrittenCount);
  const confirmedCapped = Math.min(feedbackConfirmedCount, feedbackWrittenCount);

  const overallPct = total > 0 ? Math.round((submittedCount / total) * 100) : 0;
  const submittedPct = total > 0 ? Math.round((submittedCount / total) * 100) : 0;
  const feedbackPct = total > 0 ? Math.round((feedbackWrittenCount / total) * 100) : 0;
  const confirmedPct =
    feedbackWrittenCount > 0
      ? Math.round((confirmedCapped / feedbackWrittenCount) * 100)
      : 0;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={clsx(
        "w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm",
        onClick && "cursor-pointer transition hover:shadow-md",
        className
      )}
    >
      <div className="mb-1 text-sm font-extrabold text-gray-900">현황</div>
      <p className="mb-4 text-xs text-gray-500">멘토링 과제 수행률을 한눈에 확인하세요</p>

      {/* 전체 수행률 + 막대 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">전체 수행률</span>
          <span className="text-sm font-semibold text-violet-600">{overallPct}%</span>
        </div>
        <SegmentBar
          total={total}
          notSubmitted={notSubmitted}
          submittedNoFeedback={submittedNoFeedback}
          feedbackWritten={feedbackWrittenCount}
          feedbackConfirmed={confirmedCapped}
        />
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
            미제출 ({total - submittedCount}/{total})
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
            제출·피드백대기 ({submittedNoFeedback}/{total})
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            피드백작성 ({feedbackWrittenCount}/{total})
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            피드백확인 ({confirmedCapped}/{feedbackWrittenCount})
          </span>
        </div>
      </div>

      {/* 세 가지 카드 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-gray-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FaCheckCircle className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">과제 제출 완료</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {submittedCount}/{total}
          </div>
          <div className="text-xs text-gray-500">{submittedPct}% 완료</div>
          <p className="mt-2 text-xs text-gray-400">
            멘토가 올린 과제 중 멘티가 제출을 완료한 과제 수
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-gray-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <FaCommentAlt className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">피드백 작성 완료</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {feedbackWrittenCount}/{total}
          </div>
          <div className="text-xs text-gray-500">{feedbackPct}% 완료</div>
          <p className="mt-2 text-xs text-gray-400">
            제출된 과제에 멘토가 피드백을 작성한 과제 수
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-gray-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <FaEye className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">피드백 확인</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {confirmedCapped}/{feedbackWrittenCount}
          </div>
          <div className="text-xs text-gray-500">{confirmedPct}% 완료</div>
          <p className="mt-2 text-xs text-gray-400">
            멘토의 피드백을 멘티가 확인한 과제 수 (초록 구간 내 노란색)
          </p>
        </div>
      </div>

      {onClick && (
        <p className="mt-4 text-right text-xs text-gray-400">
          * 클릭하면 자세한 정보를 볼 수 있습니다.
        </p>
      )}
    </div>
  );
}
