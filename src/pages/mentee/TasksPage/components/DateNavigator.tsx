interface DateNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function DateNavigator({ label, onPrev, onNext }: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-[26px] border border-gray-200 bg-white px-3 py-4 shadow-sm">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 hover:bg-gray-50"
          aria-label="이전 날짜"
        >
          ‹
        </button>
        <div className="min-w-[140px] text-center text-base font-semibold text-gray-900">
          {label}
        </div>
        <button
          type="button"
          onClick={onNext}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 hover:bg-gray-50"
          aria-label="다음 날짜"
        >
          ›
        </button>
      </div>
    </div>
  );
}
