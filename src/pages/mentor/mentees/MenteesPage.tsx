import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalBase from "@/shared/ui/modal/ModalBase";
import { FaRegCalendar, FaPen, FaTasks } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";
import { mentorMenteeApi } from "@/api/mentor/mentees";
import type { MentorMentee, MentorMenteeSummary } from "@/types/mentor";
import { mentorSummaryApi } from "@/api/mentor/summary";
import { MentorDashboard } from "@/pages/mentor/dashboard";
import StudentStatusDetailModal from "@/pages/mentor/components/StudentStatusDetailModal";
import ActionCard from "../components/ActionCard";
import { cn } from "@/shared/lib/cn";

import MenteeList from "../components/MenteeList";
import type { MenteeRowData } from "../components/MenteeRow";
import CalendarPicker from "../components/CalendarPicker";

export default function MenteesPage() {
  const navigate = useNavigate();

  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [summary, setSummary] = useState<MentorMenteeSummary | null>(null);
  const [pcPage, setPcPage] = useState(0);
  const pcPerPage = 5;


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

  const selectedStudent = useMemo(() => {
    if (!selectedMenteeId) return null;
    return mentees.find((x) => String(x.id) === selectedMenteeId) ?? null;
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

  const handleSelect = (row: MenteeRowData) => {
    setSelectedMenteeId(row.id);
  };

  const [calendarOpen, setCalendarOpen] = useState(false);
  

  const pcTotalPages = useMemo(
    () => Math.max(1, Math.ceil(mentees.length / pcPerPage)),
    [mentees.length]
  );

  const pcVisibleMentees = useMemo(() => {
    const start = pcPage * pcPerPage;
    return mentees.slice(start, start + pcPerPage);
  }, [mentees, pcPage]);

  useEffect(() => {
    setPcPage((p) => Math.min(p, pcTotalPages - 1));
  }, [pcTotalPages]);


  return (

    <div className="w-full">
      <div className="mb-5">
        <div className="text-base font-extrabold text-violet-900">멘티 관리</div>
        <div className="mt-2 text-sm text-gray-500">멘티별 현황을 확인 할 수 있어요.</div>
      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[560px_1fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">

            {/* 모바일: 이전/다음 */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  const list = mentees;
                  if (!list.length) return;
                  const idx = Math.max(0, list.findIndex((m) => String(m.id) === selectedMenteeId));
                  const next = idx <= 0 ? list.length - 1 : idx - 1;
                  setSelectedMenteeId(String(list[next].id));
                }}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="이전 멘티"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  const list = mentees;
                  if (!list.length) return;
                  const idx = Math.max(0, list.findIndex((m) => String(m.id) === selectedMenteeId));
                  const next = idx >= list.length - 1 ? 0 : idx + 1;
                  setSelectedMenteeId(String(list[next].id));
                }}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="다음 멘티"
              >
                ›
              </button>
            </div>

            {/* PC: 페이지네이션 */}
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => setPcPage((p) => Math.max(0, p - 1))}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                aria-label="이전 멘티"
                disabled={pcPage <= 0}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setPcPage((p) => Math.min(pcTotalPages - 1, p + 1))}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                aria-label="다음 멘티"
                disabled={pcPage >= pcTotalPages - 1}
              >
                ›
              </button>
            </div>
          </div>

          {/* 멘티 리스트 카드 */}
          <div className="w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {mentees.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMenteeId(String(m.id))}
                  className={cn(
                    "rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition",
                    "hover:shadow-md hover:border-violet-200",
                    String(m.id) === selectedMenteeId
                      ? "border-violet-300 ring-2 ring-violet-200"
                      : "border-gray-100"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        String(m.id) === selectedMenteeId
                          ? "bg-violet-100 text-violet-600"
                          : "bg-gray-100 text-gray-500"
                      )}
                      aria-hidden
                    >
                      <span className="text-sm font-bold">
                        <HiOutlineUser />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-500">
                        고등학교 {m.grade}학년
                      </div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{m.name}</div>
                      <div className="mt-2">
                        <span className="inline-flex max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                          {m.school}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* PC: 테이블 */}
            <div className="hidden lg:block">
              <MenteeList
                rows={pcVisibleMentees.map((m) => ({
                  id: String(m.id),
                  name: m.name,
                  school: m.school,
                  grade: `고등학교 ${m.grade}학년`,
                }))}
                selectedId={selectedMenteeId}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* 현황 + 액션*/}
            <aside className="w-full min-w-0 flex-1 space-y-4">
              <div className="text-sm font-extrabold text-gray-900 p-4"></div>

              {/* 날짜 */}
              <div className="flex lg:w-[560px] gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400 ">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <FaRegCalendar />
                  </span>
                  <span>
                    {selectedDate.toLocaleDateString("KR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setCalendarOpen((prev) => !prev)}
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  날짜 선택
                </button>

                {calendarOpen && (
                  <ModalBase open={calendarOpen} onClose={() => setCalendarOpen(false)}>
                    <CalendarPicker
                      selected={selectedDate}
                      onSelect={(d) => setSelectedDate(d)}
                      onClose={() => setCalendarOpen(false)}
                    />
                  </ModalBase>
                )}
              </div>

              {/* 현황 카드 (해당 일자별) */}
              <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm lg:w-[560px]">
                <div className="mb-1 text-sm font-extrabold text-gray-900">현황</div>
                <p className="mb-4 text-xs text-gray-500">멘토링 과제 수행률을 한눈에 확인하세요</p>
                {selectedStudent ? (
                  <>
                    <MentorDashboard
                      metrics={{
                        total: aggregated.todoTotal,
                        submittedCount:
                          (aggregated.pendingFeedbackTodoCount ?? 0) +
                          (aggregated.feedbackCompletedTodoCount ?? 0),
                        feedbackWrittenCount: aggregated.feedbackCompletedTodoCount ?? 0,
                        feedbackConfirmedCount: aggregated.feedbackRead ?? 0,
                      }}
                      onClick={() => setStatusModalOpen(true)}
                    />

                    <ModalBase open={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
                      <StudentStatusDetailModal
                        studentName={`고등학교 ${selectedStudent.grade}학년 · ${selectedStudent.name}`}
                        open={statusModalOpen}
                        onClose={() => setStatusModalOpen(false)}
                        summary={summary}
                      />
                    </ModalBase>
                  </>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">위에서 멘티를 선택하세요.</p>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:w-[560px]">
                <ActionCard
                  label="할 일 배정하기"
                  onClick={() => navigate(`/mentor/todo?menteeId=${selectedMenteeId ?? ""}`)}
                  iconLeft={<FaTasks className="h-4 w-4" />}
                />
                <ActionCard
                  label="피드백 작성하기"
                  onClick={() => navigate(`/mentor/feedback?menteeId=${selectedMenteeId ?? ""}`)}
                  iconLeft={<FaPen className="h-4 w-4" />}
                />
              </div>
            </aside>
          </div>
        </aside>
      </div>
    </div>
  );
}
