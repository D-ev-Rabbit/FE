export type Task = {
  id: string;
  title: string;
  done?: boolean;
  time?: string;
  date?: string;
  isMine?: boolean;
};

export type SubjectGroup = {
  id: string;
  name: string;
  tasks: Task[];
};

export type MonthGoal = {
  id: string;
  title: string;
  done?: boolean;
};

export type ViewMode = "daily" | "weekly" | "monthly";

export type MonthCell = {
  id: string;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};
