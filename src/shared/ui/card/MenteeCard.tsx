import { cn } from "@/shared/lib/cn";

type Variant = "mo" | "pc";

type Props = {
  name: string;
  grade: string; // "고등학교 2학년" 같은 텍스트
  variant: Variant;

  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 20.2c1.6-3.7 5-5.2 7.5-5.2s5.9 1.5 7.5 5.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MenteeCard({
  name,
  grade,
  variant,
  selected = false,
  onClick,
  className,
}: Props) {
  const isMo = variant === "mo";

    return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // 공통
        "group relative border bg-white transition",
        "shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)]",
        selected ? "ring-2 ring-violet-500" : "ring-0",
        isMo
          ? // 모바일 카드(세로 + 중앙정렬 + 가로스크롤용)
            "w-30 shrink-0 rounded-3xl px-4 py-4 text-center"
          : // PC 카드(가로, 리스트용)
            "w-48 shrink-0 rounded-2xl px-5 py-4 text-left",
        className
      )}
    >
      {isMo ? (
        <>
          {/* 아이콘 */}
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <PersonIcon className="h-5 w-10" />
          </div>

          {/* 학년/이름 */}
          <div className="mt-5">
            <div className="text-sm text-gray-500">{grade}</div>
            <div className="mt-2 text-base font-bold text-gray-900">{name}</div>
          </div>
        </>
      ) : (
        <>
          {/* PC: 아이콘 */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <PersonIcon className="h-6 w-6" />
          </div>

          {/* PC: 텍스트 */}
          <div className="absolute left-20 top-1/2 -translate-y-1/2">
            <div className="text-sm text-gray-500">{grade}</div>
            <div className="text-base font-bold text-gray-900">{name}</div>
          </div>
        </>
      )}
    </button>
  );

}
