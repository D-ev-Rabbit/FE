import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalBase from "@/shared/ui/modal/ModalBase";
import { FaRegCalendar, FaPen } from "react-icons/fa";

import { mentorMenteeApi } from "@/api/mentor/mentees";
import type { MentorMentee } from "@/types/mentor";
import ActionCard from "./components/ActionCard";

import MenteeList from "./components/MenteeList";
import type { MenteeRowData } from "./components/MenteeRow";
import CalendarPopover from "./components/CalendarPopover";
import SubjectFilter, { type Subject } from "./components/subjectFilter"
import { TaskCard } from "./components/TaskCard";



type Todo = {
  id: number
  title: string
  subject: Exclude<Subject, "ALL">
  menteeId: string
  date: string // "YYYY-MM-DD"
  feedbackDone: boolean
}

// test 더미 
const todos: Todo[] = [
  { id: 1, title: "비문학 3지문", subject: "KOREAN", menteeId: "1", date: "2026-02-05", feedbackDone: true },
  { id: 2, title: "단어 50개", subject: "ENGLISH", menteeId: "1", date: "2026-02-05" , feedbackDone: true },
  { id: 3, title: "미적분 10문제", subject: "MATH", menteeId: "1", date: "2026-02-05" , feedbackDone: false },
  { id: 4, title: "문법 20문제", subject: "KOREAN", menteeId: "1", date: "2026-02-06" , feedbackDone: false },
  { id: 5, title: "비문학 3지문", subject: "KOREAN", menteeId: "2", date: "2026-02-05" , feedbackDone: true },
  { id: 6, title: "단어 50개", subject: "ENGLISH", menteeId: "2", date: "2026-02-06" , feedbackDone: false },
  { id: 7, title: "미적분 10문제", subject: "MATH", menteeId: "2", date: "2026-02-05" , feedbackDone: false },
  { id: 8, title: "문법 20문제", subject: "KOREAN", menteeId: "2", date: "2026-02-06" , feedbackDone: true },

]

export default function MentorTasksPage() {
  const navigate = useNavigate();

  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const selectedStudent = useMemo(() => {
    if (!selectedMenteeId) return null;
    return mentees.find((x) => String(x.id) === selectedMenteeId) ?? null;
  }, [selectedMenteeId, mentees]);

  const handleSelect = (row: MenteeRowData) => {
    setSelectedMenteeId(row.id);
  };

  useEffect(() => {
    let ignore = false;
    mentorMenteeApi.getMentees()
      .then((res) => {
        if (ignore) return;
        setMentees(res.data ?? []);
        if ((res.data ?? []).length > 0) {
          setSelectedMenteeId(String(res.data[0].id));
        }
      })
      .catch(() => {
        if (ignore) return;
        setMentees([]);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };
  // 과제 필터
  const selectedDateStr = `${selectedDate.getFullYear()}-${String( //날짜 format 변환 
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
  const [subject, setSubject] = useState<Subject>("ALL");
  const filtered = useMemo(() => {
    if (!selectedMenteeId) return []

    // 1) 날짜 + 학생 필터
    const base = todos.filter(
      (t) => t.menteeId === selectedMenteeId && t.date === selectedDateStr
    )

    // 2) 과목 필터
    if (subject === "ALL") return base
    return base.filter((t) => t.subject === subject)
  }, [selectedMenteeId, selectedDateStr, subject]);

  return (
    <div className="w-full">
          <div className="mb-5">
            <div className="text-sm font-extrabold text-gray-900">멘티 목록</div>
          </div>
    
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px]">
            {/* 멘티 리스트 */}
            <section className="w-full ">
              <MenteeList
                rows={mentees.map((m) => ({
                  id: String(m.id),
                  name: m.name,
                  school: m.school,
                  grade: `고등학교 ${m.grade}학년`,
                }))}
                selectedId={selectedMenteeId}
                onSelect={handleSelect}
              />
            </section>
    
            {/* 오른쪽 aside */}
            <aside className="w-full space-y-4 p-4">
              {/* 날짜 + 버튼 */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <FaRegCalendar />
                  </span>
                  <span>
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {/* 캘린더 날짜 선택버튼 */}
                <button
                  type="button"
                  onClick={() => setCalendarOpen((prev) => !prev)}
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Today
                </button>
                
                {/* 캘린더 팝업 */}
                {calendarOpen && (
                  
                  <ModalBase open={calendarOpen} onClose={() => setCalendarOpen(false)}>
                    <div className="relative">
                      <CalendarPopover
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setCalendarOpen(false);
                        }}
                        onClose={() => setCalendarOpen(false)}
                      />
                    </div>
                  </ModalBase>
                  
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ActionCard
                  label="피드백 작성하기"
                  onClick={() => navigate(`/mentor/feedback?menteeId=${selectedMenteeId ?? ""}`)}
                  iconLeft={<FaPen className="h-4 w-4" />}
                />
              </div>
              {/* 과제 과목 필터버튼 */}
              <div className="pt-6 py-6 space-y-6">
                <SubjectFilter value={subject} onChange={setSubject} />
                <div className="max-h-[420px] overflow-y-auto pr-1">
                  <ul className="space-y-2">
                    {filtered.map((t) => (
                      <TaskCard
                        key={`${t.menteeId}-${t.date}-${t.subject}-${t.title}`}
                        item={{
                          menteeId: Number(selectedMenteeId),
                          date: selectedDateStr,
                          todoId: t.id,
                          subject: t.subject,
                          title: t.title,
                          feedbackDone: t.feedbackDone,
                        }}
                      />
                    ))}
                  </ul>
                </div>  
              </div>
              <div className="space-y-3">
              </div>
            </aside>
          </div>
    </div>
  );
}
