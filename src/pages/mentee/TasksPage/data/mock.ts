import type { SubjectSection, TaskItem } from "../types/tasks";

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
