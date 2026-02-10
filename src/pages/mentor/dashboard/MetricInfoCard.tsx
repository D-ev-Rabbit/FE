"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type MetricInfoCardProps = {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: number;
  max: number;
  pct: number;
  accentColor: string;
  description: string;
  subBar?: boolean;
  subBarBg?: string;
};

export function MetricInfoCard({
  icon,
  iconBg,
  title,
  value,
  max,
  pct,
  accentColor,
  description,
  subBar,
  subBarBg,
}: MetricInfoCardProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">
            {value}/{max}
          </p>
        </div>
        <span
          className="ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{
            backgroundColor: `${accentColor}18`,
            color: accentColor,
          }}
        >
          {pct}%
        </span>
      </div>

      <div
        className="relative h-2 w-full overflow-hidden rounded-full"
        style={{
          backgroundColor: subBar && subBarBg ? subBarBg : "rgb(243 244 246)",
        }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${pct}%` : "0%",
            backgroundColor: accentColor,
          }}
        />
      </div>

      <p className="text-xs leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
