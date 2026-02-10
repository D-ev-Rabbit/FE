import type { MonthCell } from "../types/calendar";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const PLANNER_DAY_START_HOUR = 5;

export const getPlannerBaseDate = (now: Date = new Date()) => {
  const base = new Date(now);
  if (base.getHours() < PLANNER_DAY_START_HOUR) {
    base.setDate(base.getDate() - 1);
  }
  base.setHours(0, 0, 0, 0);
  return base;
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day} (${DAY_LABELS[date.getDay()]})`;
};

export const formatMonthLabel = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

export const buildMonthGrid = (date: Date): MonthCell[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const firstDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = getPlannerBaseDate();
  const weeksInMonth = Math.ceil((firstDay + daysInMonth) / 7);
  const totalCells = weeksInMonth * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayIndex = index - firstDay + 1;
    const isCurrentMonth = dayIndex >= 1 && dayIndex <= daysInMonth;
    let cellDate: Date;

    if (isCurrentMonth) {
      cellDate = new Date(year, month, dayIndex);
    } else if (dayIndex < 1) {
      cellDate = new Date(year, month - 1, prevMonthDays + dayIndex);
    } else {
      cellDate = new Date(year, month + 1, dayIndex - daysInMonth);
    }

    const isToday =
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate();

    return {
      id: `${cellDate.getFullYear()}-${cellDate.getMonth()}-${cellDate.getDate()}`,
      date: cellDate,
      day: cellDate.getDate(),
      isCurrentMonth,
      isToday,
    };
  });
};

export const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateInput = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

export const dayLabels = DAY_LABELS;
