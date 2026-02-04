import { useMemo, useState } from "react";
import { mentees, statusByMenteeId, feedbackTasks } from "../data/mock";


export function useMentorHome() {
  const [selectedId, setSelectedId] = useState<string>("0");

  const selectedStudent = useMemo(
    () => mentees.find((m) => m.id === selectedId) ?? null,
    [selectedId]
  );

  const selectedStatus = useMemo(
    () => (selectedId ? statusByMenteeId[selectedId] ?? null : null),
    [selectedId]
  );

  const filteredFeedbackTasks = useMemo(
    () => feedbackTasks.filter((t) => t.menteeId === selectedId),
    [selectedId]
  );

  return {
    mentees,
    selectedId,
    setSelectedId,
    selectedStudent,
    selectedStatus,
    filteredFeedbackTasks,
  };
}
