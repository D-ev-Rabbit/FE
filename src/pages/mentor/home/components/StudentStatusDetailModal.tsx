import { FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";
import clsx from "clsx";

type Subject = "국어" | "영어" | "수학";

type Props = {
  studentName: string;
  open: boolean;
  onClose: () => void;

  // 상단 과목 탭(선택)
  subject?: Subject;
  onPrevSubject?: () => void;
  onNextSubject?: () => void;
  onSelectSubject?: (s: Subject) => void;

  // 값(나중에 API로 대체)
  avgStudyTimeText: string;         // "90H 45M"
  minTaskAchievementRate: number;   // 70
  feedbackResponseRate: number;     // 85
};

function StatRow({
  icon,
  label,
  value,
  onInfoClick,
  iconBgClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onInfoClick?: () => void;
  iconBgClassName: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={clsx("flex h-14 w-14 items-center justify-center rounded-full", iconBgClassName)}>
          {icon}
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="text-xl font-extrabold tracking-tight text-foreground">{value}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onInfoClick}
        className="rounded-full p-2 text-muted-foreground hover:bg-muted"
        aria-label="info"
      >
        <FiInfo className="h-5 w-5" />
      </button>
    </div>
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
  avgStudyTimeText,
  minTaskAchievementRate,
  feedbackResponseRate,
}: Props) {
  const subjects: Subject[] = ["국어", "영어", "수학"];

  return (
    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
      {/* 상단: 과목 스위치(옵션) */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevSubject}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-muted disabled:opacity-40"
          disabled={!onPrevSubject}
          aria-label="prev"
        >
          <FiChevronLeft />
        </button>

        <div className="flex gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSubject?.(s)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-semibold",
                subject === s ? "border-primary text-primary bg-primary/5" : "border-muted text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onNextSubject}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-muted disabled:opacity-40"
          disabled={!onNextSubject}
          aria-label="next"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">{studentName}</p>
      </div>

      {/* 내용 rows */}
      <div className="space-y-6">
        <StatRow
          icon={<span className="text-white text-2xl">👤</span>}
          iconBgClassName="bg-sky-500"
          label="설스터디와 함께한 학습 시간"
          value={avgStudyTimeText}
          onInfoClick={() => console.log("학습 시간 설명")}
        />

        <StatRow
          icon={<span className="text-white text-2xl">📄</span>}
          iconBgClassName="bg-emerald-500"
          label="멘토가 낸 최소 과제 달성률"
          value={`${minTaskAchievementRate}%`}
          onInfoClick={() => console.log("최소 과제 달성률 설명")}
        />

        <StatRow
          icon={<span className="text-white text-2xl">⏰</span>}
          iconBgClassName="bg-orange-400"
          label="멘토 피드백 응답률"
          value={`${feedbackResponseRate}%`}
          onInfoClick={() => console.log("피드백 응답률 설명")}
        />
      </div>

      {/* 하단 닫기 */}
      <div className="mt-7 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
