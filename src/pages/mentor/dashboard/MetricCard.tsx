import type { ReactNode } from "react";
import { ProgressRing } from "./ProgressRing";

type MetricCardProps = {
  title: string;
  description: string;
  value: number;
  max: number;
  color: string;
  icon: ReactNode;
};

export function MetricCard({
  title,
  description,
  value,
  max,
  color,
  icon,
}: MetricCardProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="group relative flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:border-violet-200">
      <div className="mb-4 flex w-full items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>

      <ProgressRing
        value={value}
        max={max}
        color={color}
        label={`${percentage}% 완료`}
      />

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}
