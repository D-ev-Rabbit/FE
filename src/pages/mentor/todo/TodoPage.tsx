import MenteeCard from "@/shared/ui/card/MenteeCard";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MentorMentee } from "@/types/mentor";
import TodoListTable, { type TodoItem } from "./components/TodoListTable"
import SubjectFilter, {type Subject} from "../components/subjectFilter";
import AddTodoCard from "./components/AddTodoCard";
import TodoEditModal from "./components/TodoEditModal";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { buildMonthGrid, formatMonthLabel, dayLabels } from "@/pages/mentee/CalendarPage/utils/date";
import type { MentorTodo } from "@/types/mentorTodo";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import ModalBase from "@/shared/ui/modal/ModalBase";
import { mentorMenteeApi } from "@/api/mentor/mentees";
import { mentorTodoApi } from "@/api/mentor/todo";
import { mentorPlannerApi } from "@/api/mentor/planner";
import { fileApi, type MentorTodoFile } from "@/api/file";

export default function MentorTodoPage(){
  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null)
  const [subject, setSubject] = useState<Subject>("ALL")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isLoadingTodos, setIsLoadingTodos] = useState(false)
  const [todoPage, setTodoPage] = useState(0)
  const perPage = 2
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [commentSuccessOpen, setCommentSuccessOpen] = useState(false);
  const [uploadSuccessOpen, setUploadSuccessOpen] = useState(false);
  
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [plannerComment, setPlannerComment] = useState<string | null>(null);
  const hasPlannerComment = !!plannerComment?.trim();

  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    title: string;
    description?: string;
  }>({
    open: false,
    title: "",
    description: "",
  });

  const getErrorMessage = (err: unknown, fallback: string) => {
    const msg =
      (err as any)?.response?.data?.message ||
      (err as any)?.message ||
      fallback;
    return typeof msg === "string" && msg.trim().length > 0 ? msg : fallback;
  };
  const menteeRowRef = useRef<HTMLDivElement | null>(null);
  const [pickerMonth, setPickerMonth] = useState(() => new Date());
  
  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
    selectedDate.getDate()
  ).padStart(2, "0")}`
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
  const filteredTodos = useMemo(() => {
    if (subject === "ALL") return todos
    return todos.filter((t) => t.subject === subject)
  }, [todos, subject])

  const totalTodoPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredTodos.length / perPage));
  }, [filteredTodos.length]);

  const visibleTodos = useMemo(() => {
    const start = todoPage * perPage;
    return filteredTodos.slice(start, start + perPage);
  }, [filteredTodos, todoPage]);

  useEffect(() => {
    setTodoPage((p) => Math.min(p, totalTodoPages - 1));
  }, [totalTodoPages]);

  const subjectToApi = (value: Subject | undefined) => {
    if (!value || value === "ALL") return undefined;
    if (value === "KOREAN") return "국어";
    if (value === "ENGLISH") return "영어";
    if (value === "MATH") return "수학";
    return undefined;
  };

  const subjectFromApi = (value?: string) => {
    if (!value) return "KOREAN" as TodoItem["subject"];
    if (value === "국어" || value === "KOREAN") return "KOREAN";
    if (value === "영어" || value === "ENGLISH") return "ENGLISH";
    if (value === "수학" || value === "MATH") return "MATH";
    return "KOREAN";
  };

  const pickerLabel = useMemo(() => formatMonthLabel(pickerMonth), [pickerMonth]);
  const pickerGrid = useMemo(() => buildMonthGrid(pickerMonth), [pickerMonth]);

  const scrollMentees = (dir: "left" | "right") => {
    const el = menteeRowRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const refreshTodos = useMemo(() => {
    return async () => {
      if (!selectedMenteeId) {
        setTodos([]);
        return;
      }
      setIsLoadingTodos(true);
      try {
        const res = await mentorTodoApi.getMenteeTodos(Number(selectedMenteeId), {
          date: selectedDateStr,
          subject: subjectToApi(subject),
        });
        const items = (res.data ?? []).map((t: MentorTodo) => ({
          id: t.id,
          title: t.title,
          subject: subjectFromApi(t.subject),
          date: t.date,
          done: t.isCompleted,
        }));
        setTodos(items);
      } catch {
        setTodos([]);
      } finally {
        setIsLoadingTodos(false);
      }
    };
  }, [selectedMenteeId, selectedDateStr, subject]);

  useEffect(() => {
    void refreshTodos();
  }, [refreshTodos]);

  const toggleDone = (id: number) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    mentorTodoApi.updateTodo(id, {
      title: current.title,
      date: current.date,
      subject: subjectToApi(current.subject) ?? current.subject,
      goal: "",
      isCompleted: !current.done,
    })
      .then(() => refreshTodos())
      .catch(() => {});
  }

  //todoModal
  const [editOpen, setEditOpen] = useState(false)
  const [editMode, setEditMode] = useState<"create" | "edit">("create")
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [editingFiles, setEditingFiles] = useState<MentorTodoFile[]>([])

  // 할일 추가
  const openCreate = () => {
    setEditMode("create")
    setEditingTodo(null)
    setEditOpen(true)
  }

  useEffect(() => {
    if (!editOpen || editMode !== "edit" || !editingTodo) {
      setEditingFiles([]);
      return;
    }
    let ignore = false;
    fileApi
      .getMentorTodoFiles(editingTodo.id)
      .then((res) => {
        if (ignore) return;
        setEditingFiles(res.data ?? []);
      })
      .catch(() => {
        if (ignore) return;
        setEditingFiles([]);
      });
    return () => {
      ignore = true;
    };
  }, [editOpen, editMode, editingTodo]);
  //저장 로직
  const saveTodo = ({
    title,
    date,
    subject,
    file,
  }: {
    title: string;
    date: string;
    subject: TodoItem["subject"];
    file?: File | null;
  }) => {
    if (!selectedMenteeId) return;
    if (editMode === "create") {
      mentorTodoApi.createTodo(Number(selectedMenteeId), {
        title,
        date,
        subject: subjectToApi(subject) ?? subject,
        goal: "",
        isCompleted: false,
      })
        .then(async (res) => {
          if (file) {
            try {
              await fileApi.uploadFile(res.data.id, file);
              setUploadSuccessOpen(true);
            } catch (err) {
              setErrorModal({
                open: true,
                title: "파일 업로드 실패",
                description: getErrorMessage(err, "과제 파일 업로드에 실패했어요. 잠시 후 다시 시도해주세요."),
              });
            }
          }
          refreshTodos();
          setEditOpen(false);
        })
        .catch((err) => {
          setErrorModal({
            open: true,
            title: "등록 실패",
            description: getErrorMessage(err, "할 일 등록에 실패했어요. 잠시 후 다시 시도해주세요."),
          });
        });
    } else if (editingTodo) {
      mentorTodoApi.updateTodo(editingTodo.id, {
        title,
        date,
        subject: subjectToApi(subject) ?? subject,
        goal: "",
        isCompleted: editingTodo.done,
      })
        .then(async () => {
          if (file) {
            try {
              await fileApi.uploadFile(editingTodo.id, file);
              setUploadSuccessOpen(true);
            } catch (err) {
              setErrorModal({
                open: true,
                title: "파일 업로드 실패",
                description: getErrorMessage(err, "과제 파일 업로드에 실패했어요. 잠시 후 다시 시도해주세요."),
              });
            }
          }
          refreshTodos();
          setEditOpen(false);
        })
        .catch((err) => {
          setErrorModal({
            open: true,
            title: "수정 실패",
            description: getErrorMessage(err, "할 일 수정에 실패했어요. 잠시 후 다시 시도해주세요."),
          });
        });
    }
  }

  //삭제 로직
  const deleteTodo = () => {
    if (!editingTodo) return
    mentorTodoApi.deleteTodo(editingTodo.id)
      .then(() => {
        refreshTodos();
        setEditOpen(false);
      })
      .catch((err) => {
        setErrorModal({
          open: true,
          title: "삭제 실패",
          description: getErrorMessage(err, "할 일 삭제에 실패했어요. 잠시 후 다시 시도해주세요."),
        });
      });
  }

  const openPlannerComment = () => {
    setCommentText(plannerComment ?? "");
    setCommentOpen(true);
  };

  const savePlannerComment = async () => {
    if (!selectedMenteeId || !commentText.trim()) return;
    setIsSavingComment(true);
    try {
      await mentorPlannerApi.patchPlannerComment(
        Number(selectedMenteeId),
        selectedDateStr,
        { comment: commentText.trim() }
      );
      setPlannerComment(commentText.trim());

      setCommentOpen(false);
      setCommentSuccessOpen(true);
    } catch (err) {
      setErrorModal({
        open: true,
        title: "피드백 등록 실패",
        description: getErrorMessage(err, "플래너 피드백 등록에 실패했어요. 잠시 후 다시 시도해주세요."),
      });
    } finally {
      setIsSavingComment(false);
    }
  };

  //날짜별 플래너 피드백 코멘트 상태 갱신
  useEffect(() => {
    if (!selectedMenteeId) return;

    let cancelled = false;

    const fetchPlannerComment = async () => {
      setIsLoadingComment(true);
      try {
        const res = await mentorPlannerApi.getPlannerComment(
          Number(selectedMenteeId),
          selectedDateStr
        );
        if (cancelled) return;

        console.log("[getPlannerComment] status:", res.status);
        console.log("[getPlannerComment] data:", res.data);

        const comment = res.data?.comment;
        setPlannerComment(comment?.trim() ? comment : null);
      } catch (err: any) {
        if (cancelled) return;
        console.log("[getPlannerComment] FAILED", {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err?.message,
        });
        setPlannerComment(null);
      } finally {
        if (!cancelled) setIsLoadingComment(false);
      }
    };

    fetchPlannerComment();

    return () => {
      cancelled = true;
    };
  }, [selectedMenteeId, selectedDateStr]);


  return (
    <div className="space-y-6">
      <div className="mb-5">
          <div className="text-base font-extrabold text-violet-900">할 일 관리</div>
          <div className="mt-2 text-sm text-gray-500">멘티별 할일을 등록하고 관리할 수 있어요.</div>
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
                      key={m.id}
                      name={m.name}
                      grade={`고등학교 ${m.grade}학년`}
                      variant="pc"
                      selected={String(m.id) === selectedMenteeId}
                      onClick={() => setSelectedMenteeId(String(m.id))}
                    />
                  ))}
                </div>
              </div>
            </section>

      {/* 멘티 선택시 섹션 */}
      {selectedMenteeId && (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* 달력 */}
          <section className="w-full lg:w-[420px]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
                  aria-label="이전 달"
                >
                  ‹
                </button>
                <div className="text-sm font-semibold text-gray-900">{pickerLabel}</div>
                <button
                  type="button"
                  onClick={() =>
                    setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
                  aria-label="다음 달"
                >
                  ›
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
                {dayLabels.map((day) => (
                  <div key={day} className={day === "일" ? "text-red-400" : ""}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-sm">
                {pickerGrid.map((cell) => {
                  const isSunday = cell.date.getDay() === 0;
                  const isSelected =
                    cell.date.getFullYear() === selectedDate.getFullYear() &&
                    cell.date.getMonth() === selectedDate.getMonth() &&
                    cell.date.getDate() === selectedDate.getDate();
                  return (
                    cell.isCurrentMonth ? (
                      <button
                        key={cell.id}
                        type="button"
                        onClick={() => setSelectedDate(cell.date)}
                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full transition ${
                          isSelected
                            ? "bg-violet-600 text-white"
                            : cell.isToday
                              ? "bg-violet-100 text-violet-700 shadow"
                              : isSunday
                                ? "text-red-500"
                                : "text-gray-900"
                        }`}
                        aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일`}
                      >
                        {cell.day}
                      </button>
                    ) : (
                      <div key={cell.id} className="h-8 w-8" />
                    )
                  );
                })}
              </div>
            </div>
          </section>

          {/* TodoList Table */}
          <section className="w-full min-w-0 flex-1">
            {/* 과목필터 & 플래너 피드백 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 max-w-[900px]">
              <SubjectFilter value={subject} onChange={setSubject}/>
              <button
                type="button"
                onClick={openPlannerComment}
                disabled={!selectedMenteeId || isLoadingComment}
                className="rounded-xl bg-violet-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {hasPlannerComment ? "피드백 수정하기" : "플래너 피드백하기"}
              
                
              </button>
            </div>
            <div className="p-4 w-full ">
              <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm max-w-[880px]">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">플래너 피드백</div>
                  <div className="text-xs text-gray-400">
                    {isLoadingComment ? "불러오는 중..." : hasPlannerComment ? "작성됨" : "미작성"}
                  </div>
                </div>

                <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                  {isLoadingComment ? (
                    <span className="text-gray-400">불러오는 중...</span>
                  ) : hasPlannerComment ? (
                    plannerComment
                  ) : (
                    <span className="text-gray-400">아직 작성된 피드백이 없어요.</span>
                  )}
                </div>

              </div>
            </div>
            <div className="w-full max-w-[900px] bg-white p-4">
              <div className="flex items-center justify-between pb-3">
                <div className="text-sm font-semibold text-gray-900">To do List</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTodoPage((p) => Math.max(0, p - 1))}
                    className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="이전 목록"
                    disabled={todoPage <= 0}
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTodoPage((p) => Math.min(totalTodoPages - 1, p + 1))}
                    className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="다음 목록"
                    disabled={todoPage >= totalTodoPages - 1}
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <TodoListTable
                items={visibleTodos}
                onToggleDone={toggleDone}
                onClickRow={(todo) => {
                  setEditMode("edit");
                  setEditingTodo(todo);
                  setEditOpen(true);
                }}
                className="w-full min-w-0"
              />
              {isLoadingTodos && (
                <div className="mt-3 text-xs text-gray-400">불러오는 중...</div>
              )}

              <TodoEditModal
                open={editOpen}
                mode={editMode}
                initial={editingTodo}
                files={editingFiles}
                onClose={() => setEditOpen(false)}
                onSave={saveTodo}
                onDelete={editMode === "edit" ? deleteTodo : undefined}
              />

              <div className="mt-4">
                <AddTodoCard
                  onAdd={openCreate}
                />
              </div>
            </div>
          </section>
        </div>
      )}

      <ConfirmModal
        open={errorModal.open}
        variant="error"
        title={errorModal.title}
        description={errorModal.description}
        onCancel={() => setErrorModal((prev) => ({ ...prev, open: false }))}
        onConfirm={() => setErrorModal((prev) => ({ ...prev, open: false }))}
        showCancel={false}
        confirmText="확인"
      />
      <ConfirmModal
        open={commentSuccessOpen}
        variant="success"
        title="피드백 저장 완료"
        description="멘토 플래너 피드백이 저장되었습니다."
        onCancel={() => setCommentSuccessOpen(false)}
        onConfirm={() => setCommentSuccessOpen(false)}
        showCancel={false}
        confirmText="확인"
      />
      <ConfirmModal
        open={uploadSuccessOpen}
        variant="success"
        title="파일 업로드 완료"
        description="과제 파일이 정상적으로 업로드되었습니다."
        onCancel={() => setUploadSuccessOpen(false)}
        onConfirm={() => setUploadSuccessOpen(false)}
        showCancel={false}
        confirmText="확인"
      />
      <ModalBase open={commentOpen} onClose={() => setCommentOpen(false)}>
        <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
          <div className="text-lg font-bold text-gray-900">오늘의 플래너 피드백</div>
          <div className="mt-2 text-xs text-gray-500">
            선택한 날짜({selectedDateStr})에 대한 코멘트를 남겨주세요. 새롭게 피드백한 내용으로 업데이트됩니다.
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="오늘의 학습 피드백을 입력하세요."
            className="mt-4 h-40 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-violet-300"
          />
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCommentOpen(false)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={savePlannerComment}
              disabled={isSavingComment || !commentText.trim() || !selectedMenteeId}
              className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-600/90 disabled:opacity-40"
            >
              {isSavingComment ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </ModalBase>
    </div>
  );
}
