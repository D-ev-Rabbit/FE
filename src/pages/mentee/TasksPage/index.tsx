import { useEffect, useMemo, useState } from "react";
import DateNavigator from "./components/DateNavigator";
import SubjectSection from "./components/SubjectSection";
import type { SubjectSection as SubjectSectionType } from "./types/tasks";
import { addDays, formatKoreanDate, toDateKey } from "./utils/date";
import { getMenteeTodos } from "@/api/mentee/todo";
import type { MenteeTodo } from "@/types/planner";
import DatePickerModal from "@/pages/mentee/CalendarPage/components/DatePickerModal";
import { buildMonthGrid, formatMonthLabel } from "@/pages/mentee/CalendarPage/utils/date";

const DEFAULT_SUBJECTS = ["국어", "영어", "수학"] as const;
const normalizeSubject = (value?: string) => {
  if (!value) return "기타";
  if (value === "KOREAN") return "국어";
  if (value === "ENGLISH") return "영어";
  if (value === "MATH") return "수학";
  return value;
};

export default function MenteeTasksPage() {
  const baseDate = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(() => baseDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(() => new Date());
  const [todos, setTodos] = useState<MenteeTodo[]>([]);

  const dateKey = toDateKey(selectedDate);

  useEffect(() => {
    let ignore = false;
    getMenteeTodos({ date: dateKey })
      .then((res) => {
        if (ignore) return;
        setTodos(res.data ?? []);
      })
      .catch(() => {
        if (ignore) return;
        setTodos([]);
      });
    return () => {
      ignore = true;
    };
  }, [dateKey]);

  const sections = useMemo(() => {
    const bySubject = new Map<string, SubjectSectionType>();

    DEFAULT_SUBJECTS.forEach((name) => {
      bySubject.set(name, { id: name, label: name, tasks: [] });
    });

    todos.forEach((todo) => {
      const subject = normalizeSubject(todo.subject);
      if (!bySubject.has(subject)) {
        bySubject.set(subject, { id: subject, label: subject, tasks: [] });
      }
      bySubject.get(subject)!.tasks.push({
        id: todo.id,
        title: todo.title,
        status: todo.isCompleted ? "done" : "pending",
      });
    });

    const isSection = (value: SubjectSectionType | undefined): value is SubjectSectionType =>
      Boolean(value);

    const ordered = [
      ...DEFAULT_SUBJECTS.map((name) => bySubject.get(name)).filter(isSection),
      ...Array.from(bySubject.values()).filter(
        (section) => !DEFAULT_SUBJECTS.includes(section.label as typeof DEFAULT_SUBJECTS[number])
      ),
    ];
    return ordered;
  }, [todos]);

  const pickerLabel = useMemo(() => formatMonthLabel(pickerMonth), [pickerMonth]);
  const pickerGrid = useMemo(() => buildMonthGrid(pickerMonth), [pickerMonth]);

  return (
    <div className="space-y-5 pb-6">
      <DateNavigator
        label={formatKoreanDate(selectedDate)}
        onPrev={() => setSelectedDate((prev) => addDays(prev, -1))}
        onNext={() => setSelectedDate((prev) => addDays(prev, 1))}
        onOpen={() => {
          setPickerMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
          setDatePickerOpen(true);
        }}
      />
      <div className="space-y-6">
        {sections.map((section) => (
          <SubjectSection key={section.id} section={section} />
        ))}
      </div>
      <DatePickerModal
        open={datePickerOpen}
        monthLabel={pickerLabel}
        monthGrid={pickerGrid}
        currentDate={selectedDate}
        onPrevMonth={() =>
          setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
        }
        onNextMonth={() =>
          setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
        }
        onSelectDate={(date) => {
          setSelectedDate(date);
          setDatePickerOpen(false);
        }}
        onClose={() => setDatePickerOpen(false)}
      />
    </div>
  );
}
