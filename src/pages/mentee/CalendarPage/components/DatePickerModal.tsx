import ModalBase from "@/shared/ui/modal/ModalBase";
import { HiOutlineXMark } from "react-icons/hi2";
import type { MonthCell } from "../types/calendar";
import { dayLabels } from "../utils/date";

type DatePickerModalProps = {
  open: boolean;
  monthLabel: string;
  monthGrid: MonthCell[];
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
};

export default function DatePickerModal({
  open,
  monthLabel,
  monthGrid,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onClose,
}: DatePickerModalProps) {
  return (
    <ModalBase open={open} onClose={onClose}>
      <div className="w-full max-w-xs rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
            aria-label="이전 달"
          >
            ‹
          </button>
          <div className="text-sm font-semibold text-gray-900">{monthLabel}</div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onNextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
              aria-label="다음 달"
            >
              ›
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-500 shadow-none"
              aria-label="닫기"
            >
              <HiOutlineXMark className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400">
          {dayLabels.map((day) => (
            <div key={day} className={day === "일" ? "text-red-400" : ""}>
              {day}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-sm">
          {monthGrid.map((cell) => {
            const isSunday = cell.date.getDay() === 0;
            const isSelected =
              cell.date.getFullYear() === currentDate.getFullYear() &&
              cell.date.getMonth() === currentDate.getMonth() &&
              cell.date.getDate() === currentDate.getDate();
            return (
              <div key={cell.id} className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onSelectDate(cell.date)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                    isSelected
                      ? "bg-blue-500 text-white shadow"
                      : cell.isToday
                        ? "bg-blue-100 text-blue-700"
                        : cell.isCurrentMonth
                          ? isSunday
                            ? "text-red-500"
                            : "text-gray-900"
                          : "text-gray-300"
                  }`}
                  aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
                >
                  {cell.day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ModalBase>
  );
}
