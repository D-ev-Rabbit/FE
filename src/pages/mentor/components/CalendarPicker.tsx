import { useMemo, useState } from "react";

type Props = {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose?: () => void;
  /** 우측 패널 폭: 기본 420px */
  className?: string;
};

type Cell = {
  id: string;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"] as const;

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toId(d: Date) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function CalendarPicker({ selected, onSelect, onClose, className }: Props) {
  // 달력에 표시할 “현재 월”
  const [pickerMonth, setPickerMonth] = useState<Date>(() => startOfMonth(selected));

  // 헤더 라벨 
  const pickerLabel = useMemo(() => {
    const y = pickerMonth.getFullYear();
    const m = pickerMonth.getMonth() + 1;
    return `${y}년 ${m}월`;
  }, [pickerMonth]);

  // 달력 그리드(7열)
  const pickerGrid: Cell[] = useMemo(() => {
    const today = new Date();
    const y = pickerMonth.getFullYear();
    const m = pickerMonth.getMonth();

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0); // 말일
    const firstDow = first.getDay(); // 0(일)~6(토)
    const daysInMonth = last.getDate();

    const cells: Cell[] = [];

    // 앞 빈칸
    for (let i = 0; i < firstDow; i++) {
      const d = new Date(y, m, 1 - (firstDow - i));
      cells.push({
        id: `pre-${toId(d)}`,
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
      });
    }

    // 이번달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day);
      cells.push({
        id: `cur-${toId(d)}`,
        date: d,
        day,
        isCurrentMonth: true,
        isToday: isSameDay(d, today),
      });
    }

    // 뒤 빈칸(마지막 주 7칸 채우기)
    const rest = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= rest; i++) {
      const d = new Date(y, m + 1, i);
      cells.push({
        id: `post-${toId(d)}`,
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
      });
    }

    return cells;
  }, [pickerMonth]);

  return (
    <section className={className ?? "w-full lg:w-[420px]"}>
      <div
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
            aria-label="이전 달"
          >
            ‹
          </button>

          <div className="text-sm font-semibold text-gray-900">{pickerLabel}</div>

          <button
            type="button"
            onClick={() =>
              setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>

        {/* 요일 */}
        <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
          {dayLabels.map((day) => (
            <div key={day} className={day === "일" ? "text-red-400" : ""}>
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-sm">
          {pickerGrid.map((cell) => {
            const isSunday = cell.date.getDay() === 0;
            const isSelected = isSameDay(cell.date, selected);

            if (!cell.isCurrentMonth) {
              return <div key={cell.id} className="h-8 w-8" />;
            }

            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => {
                  onSelect(cell.date);
                  
                }}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full transition ${
                  isSelected
                    ? "bg-violet-600 text-white"
                    : cell.isToday
                      ? "bg-violet-100 text-violet-700 shadow"
                      : isSunday
                        ? "text-red-500"
                        : "text-gray-900"
                }`}
                aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
              >
                {cell.day}
              </button>
              
            );
          })}
        </div>
        <div className="mt-6 flex justify-end gap-2">
            <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
                확인
            </button>
        </div>
      </div>
    </section>
  );
}
