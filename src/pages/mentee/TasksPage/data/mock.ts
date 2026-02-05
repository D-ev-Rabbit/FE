import type { FeedbackSummary, SubjectSection, TaskItem } from "../types/tasks";
import { addDays, toDateKey } from "../utils/date";

const createSections = (sections: SubjectSection[]): SubjectSection[] => sections;

export function createTaskData(baseDate: Date) {
  const todayKey = toDateKey(baseDate);
  const yesterdayKey = toDateKey(addDays(baseDate, -1));
  const tomorrowKey = toDateKey(addDays(baseDate, 1));

  const tasksByDate: Record<string, SubjectSection[]> = {
    [todayKey]: createSections([
      {
        id: "korean",
        label: "국어",
        tasks: [
          { id: 1, title: "문법 공부", status: "pending" },
          { id: 2, title: "책읽기", status: "done" },
        ],
      },
      {
        id: "english",
        label: "영어",
        tasks: [],
      },
    ]),
    [yesterdayKey]: createSections([
      {
        id: "korean",
        label: "국어",
        tasks: [{ id: 4, title: "비문학 3지문", status: "done" }],
      },
      {
        id: "english",
        label: "영어",
        tasks: [{ id: 5, title: "단어 50개", status: "done" }],
      },
    ]),
    [tomorrowKey]: createSections([
      {
        id: "korean",
        label: "국어",
        tasks: [],
      },
      {
        id: "english",
        label: "영어",
        tasks: [{ id: 6, title: "영어 에세이", status: "pending" }],
      },
    ]),
  };

  const feedbackByDate: Record<string, FeedbackSummary[]> = {
    [todayKey]: [
      { id: 1, text: "국어 문법에서 실수 줄이기: 맞춤법 체크 필수" },
      { id: 2, text: "수학 오답노트 작성 후 10분 복습" },
    ],
    [yesterdayKey]: [{ id: 3, text: "영어 단어는 예문과 함께 암기하기" }],
  };

  return { tasksByDate, feedbackByDate };
}

export type TaskDetail = TaskItem & {
  subjectLabel: string;
  dateKey: string;
};

export function findTaskById(
  tasksByDate: Record<string, SubjectSection[]>,
  taskId: number
): TaskDetail | null {
  const entries = Object.entries(tasksByDate);
  for (const [dateKey, sections] of entries) {
    for (const section of sections) {
      const task = section.tasks.find((item) => item.id === taskId);
      if (task) {
        return {
          ...task,
          subjectLabel: section.label,
          dateKey,
        };
      }
    }
  }
  return null;
}
