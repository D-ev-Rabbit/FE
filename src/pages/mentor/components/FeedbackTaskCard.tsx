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
  onClick,
  className,
}: FeedbackTaskCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
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
        <p className="text-xs text-muted-foreground">피드백 대기</p>

        {/* 제목 */}
        <h3 className="text-base font-semibold leading-snug">{title}</h3>
      </div>
    </div>
  );
}
