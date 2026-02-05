import { useMemo, useState } from "react";
import DateNavigator from "./components/DateNavigator";
import FeedbackSummaryCard from "./components/FeedbackSummaryCard";
import SubjectSection from "./components/SubjectSection";
import type { FeedbackSummary, SubjectSection as SubjectSectionType } from "./types/tasks";
import { addDays, formatKoreanDate, toDateKey } from "./utils/date";
import { createTaskData } from "./data/mock";

const SUBJECTS: Array<Pick<SubjectSectionType, "id" | "label">> = [
  { id: "korean", label: "국어" },
  { id: "english", label: "영어" },
];

const buildEmptySections = (): SubjectSectionType[] =>
  SUBJECTS.map((subject) => ({ ...subject, tasks: [] }));

export default function MenteeTasksPage() {
  const baseDate = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(() => baseDate);

  const { tasksByDate, feedbackByDate } = useMemo(
    () => createTaskData(baseDate),
    [baseDate]
  );

  const dateKey = toDateKey(selectedDate);
  const sections = tasksByDate[dateKey] ?? buildEmptySections();
  const feedbacks = feedbackByDate[dateKey] ?? [];

  return (
    <div className="space-y-5 pb-6">
      <DateNavigator
        label={formatKoreanDate(selectedDate)}
        onPrev={() => setSelectedDate((prev) => addDays(prev, -1))}
        onNext={() => setSelectedDate((prev) => addDays(prev, 1))}
      />

      <FeedbackSummaryCard items={feedbacks} />

      <div className="space-y-6">
        {sections.map((section) => (
          <SubjectSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
