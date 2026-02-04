export const parseStudyMinutes = (raw?: string) => {
  if (!raw) return 0;
  const normalized = raw.toLowerCase().replace(/\s+/g, "");
  const hourMatch = normalized.match(/(\d+)\s*h/);
  const minuteMatch = normalized.match(/(\d+)\s*m/);
  const hourMinutes = hourMatch ? Number(hourMatch[1]) * 60 : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  if (hourMatch || minuteMatch) return hourMinutes + minutes;
  const numeric = Number(normalized);
  return Number.isNaN(numeric) ? 0 : numeric;
};

export const formatStudyTime = (minutes: number) => {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  if (hours === 0) return `${remain}m`;
  if (remain === 0) return `${hours}h`;
  return `${hours}h ${remain}m`;
};
