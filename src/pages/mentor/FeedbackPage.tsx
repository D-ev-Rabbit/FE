import { useEffect, useMemo, useRef, useState } from "react";
import FeedbackModal from "@/widgets/mentor-feedback/FeedbackModal";
import type { Submission, Subject } from "@/widgets/mentor-feedback/types";
import { cn } from "@/shared/lib/cn";
import MenteeCard from "@/shared/ui/card/MenteeCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { mentorMenteeApi } from "@/api/mentor/mentees";
import type { MentorMentee } from "@/types/mentor";
import { mentorTodoApi } from "@/api/mentor/todo";
import type { MentorTodo } from "@/types/mentorTodo";
import SubjectFilter, { type Subject as TodoSubject } from "@/pages/mentor/components/subjectFilter";
import ModalBase from "@/shared/ui/modal/ModalBase";
import CalendarPicker from "@/pages/mentor/components/CalendarPicker";
import { FaRegCalendar } from "react-icons/fa";

type Mentee = {
  key: string;
  menteeName: string;
  gradeLabel: string;
};

export default function FeedbackPage() {
  const [rawMentees, setRawMentees] = useState<MentorMentee[]>([]);

  useEffect(() => {
    let ignore = false;
    mentorMenteeApi.getMentees()
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

  const mentees = useMemo<Mentee[]>(
    () =>
      rawMentees.map((m) => ({
        key: String(m.id),
        menteeName: m.name,
        gradeLabel: `고등학교 ${m.grade}학년`,
      })),
    [rawMentees]
  );

  const [selectedMenteeKey, setSelectedMenteeKey] = useState<string | null>(null);
  const selectedMentee = useMemo(
    () => mentees.find((m) => m.key === selectedMenteeKey) ?? null,
    [mentees, selectedMenteeKey]
  );

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<TodoSubject>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "INCOMPLETE">("ALL");

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
    selectedDate.getDate()
  ).padStart(2, "0")}`;
  
  // ====== 캐러셀 상태 ======
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menteeRowRef = useRef<HTMLDivElement | null>(null);

  const subjectBadge = (subject: string) => {
    switch (subject) {
      case "국어":
        return "bg-rose-50 text-rose-700 ring-rose-200";
      case "수학":
        return "bg-blue-50 text-blue-700 ring-blue-200";
      case "영어":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-200";
    }
  };

  const toSubject = (value?: string): Subject => {
    if (value === "국어" || value === "영어" || value === "수학") return value;
    return "국어";
  };

  const subjectToApi = (value: TodoSubject | undefined) => {
    if (!value || value === "ALL") return undefined;
    return value; // KOREAN | ENGLISH | MATH
  };

  const onSelectMentee = (key: string) => {
    setSelectedMenteeKey(key);
    setSelectedSubmission(null);
    setPage(0);
  };

  const scrollMentees = (dir: "left" | "right") => {
    const el = menteeRowRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (mentees.length === 0) return;
    if (!selectedMenteeKey) {
      setSelectedMenteeKey(mentees[0].key);
    }
  }, [mentees, selectedMenteeKey]);

  useEffect(() => {
    if (!selectedMenteeKey || !selectedMentee) {
      setSubmissions([]);
      return;
    }
    let ignore = false;
    setIsLoadingSubmissions(true);
    mentorTodoApi
      .getMenteeTodos(Number(selectedMenteeKey), {
        date: selectedDateStr,
        subject: subjectToApi(subjectFilter),
        isCompleted:
          statusFilter === "ALL" ? undefined : statusFilter === "COMPLETED",
      })
      .then((res) => {
        if (ignore) return;
        const items = (res.data ?? []).map((t: MentorTodo) => ({
          id: String(t.id),
          menteeName: selectedMentee.menteeName,
          gradeLabel: selectedMentee.gradeLabel,
          submittedAt: t.date,
          subject: toSubject(t.subject),
          title: t.title,
          isCompleted: t.isCompleted,
          menteeId: Number(selectedMenteeKey),
          files: [],
        }));
        setSubmissions(items);
      })
      .catch(() => {
        if (ignore) return;
        setSubmissions([]);
      })
      .finally(() => {
        if (ignore) return;
        setIsLoadingSubmissions(false);
      });
    return () => {
      ignore = true;
    };
  }, [selectedMenteeKey, selectedMentee, selectedDateStr, subjectFilter, statusFilter]);

  // 화면 크기에 따라 "한 줄에 보이는 카드 개수" 자동 계산
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const calc = () => {
      const w = el.clientWidth;

      // 카드 최소 폭(대충): 모바일=100%, sm=340, lg=320, xl=300 정도 느낌
      // 원하는 카드 폭에 따라 숫자만 조절하면 됨.
      const minCard =
        window.innerWidth < 640 ? w : window.innerWidth < 1024 ? 340 : window.innerWidth < 1280 ? 320 : 300;

      const gap = 16; // gap-4
      const fit = Math.max(1, Math.floor((w + gap) / (minCard + gap)));

      setPerPage(fit);
    };

    calc();

    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener("resize", calc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, [selectedMenteeKey]);

  // mentee 바뀌거나 perPage 바뀌면 page가 범위 밖으로 나가는 거 방지
  useEffect(() => {
    if (!selectedMentee) return;
    const totalPages = Math.max(1, Math.ceil(submissions.length / perPage));
    setPage((p) => Math.min(p, totalPages - 1));
  }, [perPage, selectedMentee, submissions.length]);

  return (
    <div className="w-full">
      <div className="mb-5">
        <div className="text-base font-extrabold text-violet-900">과제 피드백</div>
        <div className="mt-2 text-sm text-gray-500">멘티를 선택하고 과제를 선택하면 피드백 모달이 열려요.</div>
      </div>

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
                variant="pc"
                selected={m.key === selectedMenteeKey}
                onClick={() => onSelectMentee(m.key)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 과제 캐러셀 */}
      <section className="mt-6 w-full min-w-0 rounded-3xl border border-gray-200 bg-white p-4 lg:flex lg:flex-col">
          {!selectedMentee ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              멘티를 선택해서 피드백을 남겨보세요.
            </div>
          ) : (() => {
            const items = submissions;
            const totalPages = Math.max(1, Math.ceil(items.length / perPage));
            const showNav = items.length > perPage;

            const canPrev = page > 0;
            const canNext = page < totalPages - 1;

            const start = page * perPage;
            const visible = items.slice(start, start + perPage);

            return (
              <>
                <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
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
                    </div>

                    <SubjectFilter value={subjectFilter} onChange={setSubjectFilter} />
                    <div className="hidden items-center justify-center lg:flex">
                      <span className="text-gray-300">|</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        { key: "ALL", label: "전체" },
                        { key: "COMPLETED", label: "해결완료" },
                        { key: "INCOMPLETE", label: "미완료" },
                      ].map((item) => {
                        const active = statusFilter === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setStatusFilter(item.key as any)}
                            className={cn(
                              "inline-flex items-center justify-center whitespace-nowrap",
                              "h-7 px-5 rounded-full border",
                              "text-sm font-semibold leading-none",
                              "min-w-[64px]",
                              "transition-colors",
                              active
                                ? "border-violet-600 bg-violet-50 text-violet-700"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-400">과제 목록</div>

                  {/* 페이지 인디케이터 */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition",
                            i === page ? "bg-violet-600" : "bg-gray-300"
                          )}
                          aria-hidden
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 캐러셀 컨테이너 */}
                <div ref={containerRef} className="relative mt-3">
                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
                      해당 조건의 과제가 없습니다.
                    </div>
                  ) : (
                    <>
                      {/* 오버레이 버튼 (동그라미) */}
                      {showNav && (
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.max(0, p - 1))}
                          disabled={!canPrev}
                          className={cn(
                            "absolute left-2 top-1/2 z-10 -translate-y-1/2",
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            "bg-white/90 shadow-md ring-1 ring-gray-200 backdrop-blur",
                            "transition hover:bg-white",
                            !canPrev && "pointer-events-none opacity-40"
                          )}
                          aria-label="이전 과제"
                        >
                          <FiChevronLeft className="h-5 w-5 shrink-0 text-gray-700" />
                        </button>
                      )}

                      {/* 오버레이 버튼 (동그라미) */}
                      {showNav && (
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                          disabled={!canNext}
                          className={cn(
                            "absolute right-2 top-1/2 z-10 -translate-y-1/2",
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            "bg-white/90 shadow-md ring-1 ring-gray-200 backdrop-blur",
                            "transition hover:bg-white",
                            !canNext && "pointer-events-none opacity-40"
                          )}
                          aria-label="다음 과제"
                        >
                          <FiChevronRight className="h-5 w-5 shrink-0 text-gray-700" />
                        </button>
                      )}

                      {/* 한 줄만 보이게: flex + overflow-hidden */}
                      <div className="overflow-hidden">
                        <div className="flex gap-4">
                          {visible.map((s, idx) => (
                            <button
                              key={`${s.id}-${s.submittedAt}-${idx}`}
                              type="button"
                              onClick={() => {
                                mentorTodoApi
                                  .getTodo(Number(s.id))
                                  .then((res) => {
                                    const detail = res.data as any;
                                    const filesSource = detail?.files ?? [];
                                    const files = (filesSource ?? [])
                                      .map((f: any) => ({
                                        fileId: f.fileId ?? f.id,
                                        url: f.url,
                                        type: f.type,
                                        name: f.name,
                                        feedbacks: f.feedbacks ?? [],
                                      }))
                                      .filter((f: any) => Boolean(f.url) && Boolean(f.fileId));
                                    setSelectedSubmission({
                                      ...s,
                                      subject: toSubject(detail?.subject ?? s.subject),
                                      submittedAt: detail?.date ?? s.submittedAt,
                                      title: detail?.title ?? s.title,
                                      goal: detail?.goal ?? s.goal,
                                      isCompleted: detail?.isCompleted ?? s.isCompleted,
                                      files,
                                    });
                                  })
                                  .catch(() => {
                                    setSelectedSubmission(s);
                                  });
                              }}
                              className={cn(
                                "group overflow-hidden rounded-3xl border border-gray-200 bg-white text-left",
                                "transition hover:border-violet-300 hover:shadow-md",
                                "shrink-0",
                                "w-full",
                                perPage === 1
                                  ? "basis-full"
                                  : perPage === 2
                                    ? "basis-[calc(50%-8px)]"
                                    : "basis-[calc(33.333%-10.7px)]"
                              )}
                            >
                              <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-gray-100">
                                {s.files?.[0]?.url ? (
                                  <img
                                    src={s.files?.[0]?.url}
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-100" />
                                )}
                                <div
                                  className={cn(
                                    "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ring-1 backdrop-blur-sm",
                                    subjectBadge(s.subject),
                                    "bg-white/80"
                                  )}
                                >
                                  {s.subject}
                                </div>
                            <div
                              className={cn(
                                "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ring-1 backdrop-blur-sm",
                                "bg-white/80",
                                s.isCompleted ? "text-emerald-700 ring-emerald-200" : "text-amber-700 ring-amber-200"
                              )}
                            >
                              {s.isCompleted ? "해결 완료" : "미완료"}
                            </div>
                              </div>

                              <div className="p-4">
                                <div className="text-sm font-extrabold text-gray-900">
                                  {s.title ?? `${s.subject} 과제`}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">제출일: {s.submittedAt}</div>
                                <div className="mt-2 text-xs text-gray-500">
                                  이미지 <span className="font-bold text-gray-700">{s.files?.length ?? 0}</span>장
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {isLoadingSubmissions && (
                    <div className="mt-3 text-xs text-gray-400">불러오는 중...</div>
                  )}
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  과제를 클릭하면 이미지에 핀 코멘트를 남기고 전체 코멘트를 저장할 수 있어요.
                </div>
              </>
            );
          })()}
        </section>

      <ModalBase open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <CalendarPicker
          selected={selectedDate}
          onSelect={(d) => setSelectedDate(d)}
          onClose={() => setCalendarOpen(false)}
        />
      </ModalBase>

      <FeedbackModal
        open={!!selectedSubmission}
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onSaved={(id) => {
          setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, isCompleted: true } : s)));
          setSelectedSubmission((prev) => (prev && prev.id === id ? { ...prev, isCompleted: true } : prev));
        }}
      />
    </div>
  );
}
