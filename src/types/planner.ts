export interface TodoCounts {
  total: number;
  completed: number;
}

export interface StudySummary {
  totalSeconds: number;
  bySubject: Record<string, number>; // 과목명: 초
}

export type MenteePlannerResponse = {
  plannerId: number;
  date: string; // "YYYY-MM-DD"
  comment: string;
  todoCounts: {
    total: number;
    completed: number;
  };
  studySummary: {
    totalSeconds: number;
    bySubject: Record<string, number>; // { "국어": 1200, "수학": 3600 ... } seconds
  };
};


export type MenteeTodo = {
  id: number;
  menteeId?: number;
  creatorId?: number;
  title: string;
  date: string; // YYYY-MM-DD
  subject: string;
  goal?: string;
  isCompleted: boolean;
  comment?: string;
};

export type SubjectGroup = {
  id: string;
  name: string;
  tasks: {
    id: string;          // UI용
    todoId: number;      // ✅ 서버 PK
    title: string;
    done: boolean;
    time: string;
    dateKey: string;
  }[];
};


export type GetMenteeTodosParams = {
  date?: string; // query
  isCompleted?: boolean;
  subject?: string;
};

export type CreateMenteeTodoBody = {
  title: string;
  date: string;
  subject: string;
  goal?: string;
  isCompleted?: boolean;
};

export type CreateMenteeTodoResponse = {
  id: number;
  menteeId: number;
  creatorId: number;
  title: string;
  date: string;
  subject: string;
  goal: string | null;
  isCompleted: boolean;
  comment: string | null;
};

export type SubjectTask = {
  id: string;        // todo id
  title: string;     // 할 일 제목
  done: boolean;     // 완료 여부
  time: string;      // 공부 시간 (ex: "30m", "1h")
  dateKey?: string;  // 선택 날짜 (선택값)
};

export type PatchMenteeTodoBody = {
  title: string;
  date: string; // YYYY-MM-DD
  subject: string;
  goal: string;
  isCompleted: boolean;
};
