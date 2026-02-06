import { useEffect, useMemo, useState } from "react";
import { mentorMenteeApi } from "@/api/mentor/mentees";
import type { MentorMentee } from "@/types/mentor";


export function useMentorHome() {
  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [selectedId, setSelectedId] = useState<string>("0");

  useEffect(() => {
    let ignore = false;
    mentorMenteeApi.getMentees()
      .then((res) => {
        if (ignore) return;
        const items = res.data ?? [];
        setMentees(items);
        if (items.length > 0) setSelectedId(String(items[0].id));
      })
      .catch(() => {
        if (ignore) return;
        setMentees([]);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const selectedStudent = useMemo(
    () => mentees.find((m) => String(m.id) === selectedId) ?? null,
    [selectedId, mentees]
  );

  const menteeRows = useMemo(
    () =>
      mentees.map((m) => ({
        id: String(m.id),
        name: m.name,
        grade: `고등학교 ${m.grade}학년`,
      })),
    [mentees]
  );

  const selectedRow = useMemo(
    () =>
      selectedStudent
        ? { id: String(selectedStudent.id), name: selectedStudent.name, grade: `고등학교 ${selectedStudent.grade}학년` }
        : null,
    [selectedStudent]
  );

  const selectedStatus = null;
  const filteredFeedbackTasks: any[] = [];

  return {
    mentees: menteeRows,
    selectedId,
    setSelectedId,
    selectedStudent: selectedRow,
    selectedStatus,
    filteredFeedbackTasks,
  };
}
