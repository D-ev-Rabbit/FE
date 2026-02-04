import type React from "react";

type ActionCardProps = {
  label: string;
  onClick?: () => void;
  iconLeft?: React.ReactNode;
};

export default function ActionCard({ label, onClick, iconLeft }: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="text-xs font-bold text-violet-500">토픽</div>

      <div className="mt-1 text-sm font-semibold text-gray-900">{label}</div>

      <div className="mt-3 h-px w-full bg-gray-100" />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-violet-500">
          <span className="text-lg">{iconLeft}</span>
          <span className="text-lg">✓</span>
        </div>

        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 group-hover:text-gray-600">
          →
        </span>
      </div>
    </button>
  );
}
