import clsx from "clsx";

type Badge = {
  label: string;
};

type Mentee = {
  name: string;
  avatarUrl?: string; // 없으면 기본 아바타
};

interface FeedbackTaskCardProps {
  menteeId: string;
  thumbnailUrl: string;
  subjectTag?: Badge; // 예: { label: "국어" }
  title: string;      // 예: "국어 24번"
  progress: number;   // 0~100
  mentee: Mentee;

  progressBarClassName?: string;
  progressTrackClassName?: string;

  liked?: boolean;
  onLikeClick?: () => void;
  onMoreClick?: () => void;
  onClick?: () => void;
  className?: string;
}

export default function FeedbackTaskCard({
  thumbnailUrl,
  subjectTag,
  title,
  progress,
  mentee,
  progressBarClassName = "bg-purple-500",
  progressTrackClassName = "bg-purple-100",
  onClick,
  className,
}: FeedbackTaskCardProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}   // ✅ (2) 최상단에 실제 연결
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
      className={clsx(
        "min-w-[360px] max-w-[420px] overflow-hidden rounded-2xl border bg-white shadow-sm",
        className
      )}
    >
      {/* 썸네일 */}
      <div className="relative h-40 w-full">
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        
      </div>

      {/* 본문 */}
      <div className="space-y-3 px-5 py-4">
        {/* 태그 */}
        {subjectTag?.label && (
          <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-600  px-2.5 py-1 text-xs font-medium text-primary">
            {subjectTag.label}
          </span>
        )}

        {/* 제목 */}
        <h3 className="text-base font-semibold leading-snug">{title}</h3>

        {/* 진행바 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-700">진행률</p>
            <p className="text-xs text-gray-500">{safeProgress}%</p>
          </div>

          <div className={clsx("h-2 w-full rounded-full", progressTrackClassName)}>
            <div
              className={clsx("h-2 rounded-full transition-all", progressBarClassName)}
              style={{ width: `${safeProgress}%` }}
            />
          </div>
          
        </div>

        {/* 멘티 프로필 + 이름 */}
        <div className="flex items-center gap-3 pt-1">
          {mentee.avatarUrl ? (
            <img
              src={mentee.avatarUrl}
              alt={mentee.name}
              className="h-9 w-9 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {mentee.name.slice(0, 1)}
            </div>
          )}

          <div className="leading-tight">
            <p className="text-sm font-medium">{mentee.name}</p>
            <p className="text-xs text-muted-foreground">피드백 대기</p>
          </div>
        </div>
      </div>
    </div>
  );
}
