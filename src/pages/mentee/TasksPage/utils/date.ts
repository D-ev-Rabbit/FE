const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

export function addDays(base: Date, amount: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + amount);
  return next;
}

export function toDateKey(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseDateKey(value: string) {
  const [yyyy, mm, dd] = value.split("-").map((part) => Number(part));
  if (!yyyy || !mm || !dd) return new Date();
  return new Date(yyyy, mm - 1, dd);
}

export function formatKoreanDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const weekday = WEEKDAYS_KO[date.getDay()];
  return `${yyyy}.${mm}.${dd} (${weekday})`;
}
