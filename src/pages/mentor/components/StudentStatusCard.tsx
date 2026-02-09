import clsx from "clsx";

type StatusItem = {
  label: string;
  current: number;
  total: number;
  barClassName: string;
  trackClassName: string;
  /** true면 비율(0~100)에 따라 bar/track 색상 자동 적용 */
  useRatioColor?: boolean;
};

function getRatioColor(pct: number): { bar: string; track: string } {
  if (pct <= 0) return { bar: "bg-gray-300", track: "bg-gray-100" };
  if (pct < 34) return { bar: "bg-red-500", track: "bg-red-100" };
  if (pct < 67) return { bar: "bg-amber-500", track: "bg-amber-100" };
  return { bar: "bg-green-500", track: "bg-green-100" };
}

interface StudentStatusCardProps {
  studentName: string;
  periodLabel?: string; // Today 같은 표시
  items: StatusItem[];
  onClick?: () => void;
  className?: string;
}

export default function StudentStatusCard({
  items,
  onClick,
  className,
}: StudentStatusCardProps) {
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
        "w-full min-w-0 rounded-2xl bg-white p-6 shadow-sm border",
        onClick && "cursor-pointer transition hover:shadow-md",
        className
      )}
    >
      <div className="w-full max-w-xl rounded-2xl bg-white ">
        <div className="mt-6 space-y-6">
          {items.map((it) => {
            const pct =
              it.total <= 0 ? 0 : Math.min(100, Math.max(0, (it.current / it.total) * 100));
            const colors = it.useRatioColor
              ? getRatioColor(pct)
              : { bar: it.barClassName, track: it.trackClassName };

            return (
              <div key={it.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{it.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {it.current}/{it.total}
                  </p>
                </div>

                <div className={`h-2 w-full rounded-full ${colors.track}`}>
                  <div
                    className={`h-2 rounded-full ${colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p className="mt-3 text-xs text-right text-muted-foreground">* 클릭하면 자세한 정보를 볼 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
