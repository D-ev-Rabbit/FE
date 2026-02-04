import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function CalendarPopover({ selected, onSelect, onClose }: Props) {
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
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        captionLayout="dropdown"          // 연/월 선택
        fromYear={2000}                   // 시작 연도
        toYear={2035}                     // 끝 연도
      />

    </div>
  );
}
