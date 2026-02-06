import { useMemo } from "react";

type Props = {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function CalendarPopover({ selected, onSelect, onClose }: Props) {
  const value = useMemo(() => {
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [selected]);

  return (
    <div className="rounded-md border p-9 py-10 text-sm  bg-white text-muted-foreground">
      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 rounded-md px-2 py-1
                   text-sm text-gray-400 hover:bg-gray-100"
      >
        ✕
      </button>
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-gray-500">날짜 선택</label>
        <input
          type="date"
          value={value}
          onChange={(e) => {
            if (!e.target.value) return;
            onSelect(new Date(e.target.value));
          }}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        />
      </div>

    </div>
  );
}
