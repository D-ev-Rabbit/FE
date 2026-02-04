import clsx from "clsx";

type StatusItem = {
  label: string;
  current: number;
  total: number;
  // 진행바 색상 class (예: "bg-green-500")
  barClassName: string;
  // 배경 트랙 색상 class (예: "bg-green-100")
  trackClassName: string;
};

interface StudentStatusCardProps {
  studentName: string;
  periodLabel?: string; // Today 같은 표시
  items: StatusItem[];
  onClick?: () => void;
  className?: string;
}

export default function StudentStatusCard({
  studentName,
  periodLabel = "Today",
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
        "w-full max-w-xl rounded-2xl bg-white p-4 shadow-sm border",
        onClick && "cursor-pointer hover:shadow-md transition",
        className
      )}
    >
        <div className="p-6">
        <div className="flex items-start justify-between">
            <div>
            <p className="text-lg font-semibold">현황</p>
            <p className="mt-1 text-sm text-muted-foreground">{studentName}</p>
            </div>

            <div className="rounded-md border px-4 py-2 text-sm text-muted-foreground">
            {periodLabel}
            </div>
        </div>

        <div className="mt-6 space-y-6">
            {items.map((it) => {
            const pct =
                it.total <= 0 ? 0 : Math.min(100, Math.max(0, (it.current / it.total) * 100));

            return (
                <div key={it.label} className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{it.label}</p>
                    <p className="text-sm text-muted-foreground">
                    {it.current}/{it.total}
                    </p>
                </div>

                <div className={`h-2 w-full rounded-full ${it.trackClassName}`}>
                    <div
                    className={`h-2 rounded-full ${it.barClassName}`}
                    style={{ width: `${pct}%` }}
                    />
                </div>
                </div>
            );
            })}
        </div>
        </div>
    </div>
  );
}
