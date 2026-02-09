import { useEffect, useState } from "react";

type SummaryBarItem = {
  label: string;
  value: number;
  max: number;
  color: string;
};

type SummaryBarProps = {
  items: SummaryBarItem[];
};

export function SummaryBar({ items }: SummaryBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const totalMax = items.reduce((sum, item) => sum + item.max, 0);
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalValue / totalMax) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">전체 수행률</h3>
        <span className="text-2xl font-bold text-gray-900">
          {overallPercentage}
          <span className="text-sm font-normal text-gray-500">%</span>
        </span>
      </div>

      <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        {items.map((item, index) => {
          const width = totalMax > 0 ? (item.value / totalMax) * 100 : 0;
          return (
            <div
              key={index}
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${width}%` : "0%",
                backgroundColor: item.color,
                marginLeft: index > 0 ? 2 : 0,
              }}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-500">
              {item.label} ({item.value}/{item.max})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
