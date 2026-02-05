import type { FeedbackSummary } from "../types/tasks";

interface FeedbackSummaryCardProps {
  items: FeedbackSummary[];
}

export default function FeedbackSummaryCard({ items }: FeedbackSummaryCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-700">중요 피드백 요약</div>
      <div className="mt-3 min-h-[72px] text-sm text-gray-600">
        {items.length === 0 ? (
          <div className="text-gray-400">중요 피드백이 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span className="leading-5">{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
