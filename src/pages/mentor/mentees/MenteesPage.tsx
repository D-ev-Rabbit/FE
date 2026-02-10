import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCalendar } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MenteeCard from "@/shared/ui/card/MenteeCard";
import type { MentorMentee, MentorMenteeSummary } from "@/types/mentor";
import { mentorMenteeApi } from "@/api/mentor/mentees";
import { mentorSummaryApi } from "@/api/mentor/summary";
import { MentorDashboard } from "@/pages/mentor/dashboard";
import CalendarPicker from "../components/CalendarPicker";
import ModalBase from "@/shared/ui/modal/ModalBase";

type Mentee = {
  key: string;
  menteeName: string;
  gradeLabel: string;
  schoolLabel: string;
};

export default function MenteesPage() {
  const navigate = useNavigate();

  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [selectedMenteeKey, setSelectedMenteeKey] = useState<string | null>(null);
  const [summary, setSummary] = useState<MentorMenteeSummary | null>(null);
  const [rawMentees, setRawMentees] = useState<MentorMentee[]>([]);
  const menteeRowRef = useRef<HTMLDivElement | null>(null);


  const mentees = useMemo<Mentee[]>(
    () =>
      rawMentees.map((m) => ({
        key: String(m.id),
        menteeName: m.name,
        gradeLabel: `${m.grade}학년`,
        schoolLabel: m.school,
      })),
    [rawMentees]
  );
  useEffect(() => {
    let ignore = false;
    mentorMenteeApi
      .getMentees()
      .then((res) => {
        if (ignore) return;
        setRawMentees(res.data ?? []);
      })
      .catch(() => {
        if (ignore) return;
        setRawMentees([]);
      });
    return () => {
      ignore = true;
    };
  }, []);
  useEffect(() => {
    if (!selectedMenteeId && mentees.length > 0) {
      setSelectedMenteeId(mentees[0].key);
      setSelectedMenteeKey(mentees[0].key);
    }
  }, [selectedMenteeId, mentees]);
  const selectedStudent = useMemo(() => {
    if (!selectedMenteeId) return null;
    return mentees.find((x) => String(x.key) === selectedMenteeId) ?? null;
  }, [selectedMenteeId, mentees]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateStr = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedMenteeId) {
      setSummary(null);
      return;
    }
    let ignore = false;
    mentorSummaryApi
      .getMenteeSummary(Number(selectedMenteeId), selectedDateStr)
      .then((res) => {
        if (ignore) return;
        setSummary(res.data);
      })
      .catch(() => {
        if (ignore) return;
        setSummary(null);
      });
    return () => {
      ignore = true;
    };
  }, [selectedMenteeId, selectedDateStr]);

  const aggregated = useMemo(() => {
    const subjects = summary?.subjects ?? {};
    return Object.values(subjects).reduce(
      (acc, cur) => {
        acc.todoTotal += cur.todoTotal ?? 0;
        acc.todoCompleted += cur.todoCompleted ?? 0;
        acc.feedbackTotal += cur.feedbackTotal ?? 0;
        acc.feedbackRead += cur.feedbackRead ?? 0;
        acc.submittedFileCount += cur.submittedFileCount ?? 0;
        acc.pendingFeedbackTodoCount += cur.pendingFeedbackTodoCount ?? 0;
        acc.feedbackCompletedTodoCount += cur.feedbackCompletedTodoCount ?? 0;
        return acc;
      },
      {
        todoTotal: 0,
        todoCompleted: 0,
        feedbackTotal: 0,
        feedbackRead: 0,
        submittedFileCount: 0,
        pendingFeedbackTodoCount: 0,
        feedbackCompletedTodoCount: 0,
      }
    );
  }, [summary]);


  const onSelectMentee = (key: string) => {
    setSelectedMenteeKey(key);
    setSelectedMenteeId(key);
  };

  const [calendarOpen, setCalendarOpen] = useState(false);


  const scrollMentees = (dir: "left" | "right") => {
    const el = menteeRowRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (

    <div className="w-full">
      <div className="mb-5">
        <div className="text-base font-extrabold text-violet-900">멘티 관리</div>
        <div className="mt-2 text-sm text-gray-500">멘티별 현황을 확인 할 수 있어요.</div>
      </div>


      <div className="flex flex-col gap-6">
        {/* 멘티 선택 (Home 스타일) */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-400">멘티 목록</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollMentees("left")}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="이전 멘티"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollMentees("right")}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="다음 멘티"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div
              ref={menteeRowRef}
              className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollbarWidth: "none" as any }}
            >
              {mentees.map((m) => (
                <MenteeCard
                  key={m.key}
                  name={m.menteeName}
                  grade={m.gradeLabel}
                  school={m.schoolLabel}
                  variant="pc"
                  selected={m.key === selectedMenteeKey}
                  onClick={() => onSelectMentee(m.key)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 아래: 대시보드(날짜 + 현황 + 액션) */}
        <aside className="w-full space-y-4">
          <div className="flex flex-col gap-6">
            <div className="w-full min-w-0 space-y-4">
              {/* 날짜 + 액션(태그 자리) */}
              <div className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                    <FaRegCalendar />
                  </span>
                  <span>
                    {selectedDate.toLocaleDateString("ko-KR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen((prev) => !prev)}
                    className="ml-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    날짜 선택
                  </button>
                  <div className="mx-2 hidden h-4 w-px bg-gray-200 lg:block" />
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/todo?menteeId=${selectedMenteeId ?? ""}`)}
                    className="group inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-100"
                  >
                    할 일 배정하기
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-300 text-violet-400 group-hover:text-gray-600">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/feedback?menteeId=${selectedMenteeId ?? ""}`)}
                    className="group inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-100"
                  >
                    피드백 작성하기
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-300 text-violet-400 group-hover:text-gray-600">
                      →
                    </span>
                  </button>
                </div>
              </div>
              {calendarOpen && (
                <ModalBase open={calendarOpen} onClose={() => setCalendarOpen(false)}>
                  <CalendarPicker
                    selected={selectedDate}
                    onSelect={(d) => setSelectedDate(d)}
                    onClose={() => setCalendarOpen(false)}
                  />
                </ModalBase>
              )}
              {/* 현황 카드 (해당 일자별) */}
              <div className="w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-gray-400">현황</div>
                <p className="mb-4 text-xs text-gray-500">멘토링 과제 수행률을 한눈에 확인하세요</p>
                {selectedStudent ? (
                  <MentorDashboard
                    metrics={{
                      total: aggregated.todoTotal,
                      submittedCount:
                        (aggregated.pendingFeedbackTodoCount ?? 0) +
                        (aggregated.feedbackCompletedTodoCount ?? 0),
                      feedbackWrittenCount: aggregated.feedbackCompletedTodoCount ?? 0,
                      feedbackConfirmedCount: aggregated.feedbackRead ?? 0,
                    }}
                  />
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">위에서 멘티를 선택하세요.</p>
                )}
              </div>    
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
