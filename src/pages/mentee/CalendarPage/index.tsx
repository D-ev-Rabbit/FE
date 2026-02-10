import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "./components/AddTaskModal";
import DatePickerModal from "./components/DatePickerModal";
import DailyNoteModal from "./components/DailyNoteModal";
import DailyRecordPage from "./components/DailyRecordPage";
import DailyView from "./components/DailyView";
import MonthlyView from "./components/MonthlyView";
import TaskActionModal from "./components/TaskActionModal";
import WeeklyView from "./components/WeeklyView";
import useCalendarState from "./hooks/useCalendarState";
import { buildMonthGrid, formatMonthLabel } from "./utils/date";

import { createMenteeTodo, deleteMenteeTodo, getMenteeTodos, patchMenteeTodo } from "@/api/mentee/todo";
import type { MenteeTodo, SubjectGroup } from "@/types/planner";
import { menteeStudySessionApi } from "@/api/mentee/studySession";
import type { StudySession } from "@/types/studySession";
import { menteePlannerApi } from "@/api/mentee/planner";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";

export default function MenteeCalendarPage() {
  const navigate = useNavigate();
  const DEFAULT_SUBJECTS = ["국어", "영어", "수학"] as const;
  const normalizeSubject = (value?: string) => {
    if (!value) return "기타";
    if (value === "KOREAN") return "국어";
    if (value === "ENGLISH") return "영어";
    if (value === "MATH") return "수학";
    return value;
  };
  const toApiSubject = (value?: string) => {
    if (!value) return "";
    if (value === "국어") return "KOREAN";
    if (value === "영어") return "ENGLISH";
    if (value === "수학") return "MATH";
    return value; // already API code or custom
  };
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(() => new Date());
  const toDateKey = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const addDays = (dateKey: string, days: number) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    return toDateKey(dt);
  };

  const {
    currentDate,
    currentDateKey,
    viewMode,
    dailySubjects,
    openSubjects,
    isModalOpen,
    selectedSubject,
    taskDraftText,
    taskActionOpen,
    activeTask,
    taskEditOpen,
    taskDraftTitle,
    taskDateOpen,
    taskDraftDate,
    monthGoals,
    goalModalOpen,
    goalDraftTitle,
    goalEditId,
    goalActionOpen,
    dailyNoteOpen,
    dailyNoteText,
    todayLabel,
    monthLabel,
    monthGrid,
    totalCount,
    doneCount,
    weekStart,
    weekDays,
    setViewMode,
    setIsModalOpen,
    setTaskDraftText,
    setTaskActionOpen,
    setTaskEditOpen,
    setTaskDraftTitle,
    setTaskDateOpen,
    setTaskDraftDate,
    setGoalModalOpen,
    setGoalDraftTitle,
    setGoalActionOpen,
    setDailyNoteOpen,
    setDailyNoteText,
    toggleSubject,
    openAddTask,
    goToPrevDay,
    goToNextDay,
    goToPrevMonth,
    goToNextMonth,
    selectDateFromMonth,
    openTaskActions,
    toggleTaskDone,
    openTaskEdit,
    openTaskDate,
    goToPrevWeek,
    goToNextWeek,
    openAddGoal,
    openGoalActions,
    openEditGoal,
    saveGoal,
    toggleGoalDone,
    deleteGoal,
    getTasksForDate,
    saveDailyNote,
  } = useCalendarState();


  const [todos, setTodos] = useState<MenteeTodo[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [mentorComment, setMentorComment] = useState("");
  const [plannerTodoCounts, setPlannerTodoCounts] = useState<{ total: number; completed: number } | null>(null);
  const [errorModal, setErrorModal] = useState<{ open: boolean; title: string; description?: string }>({
    open: false,
    title: "",
    description: "",
  });
  const [weeklySessionsByDate, setWeeklySessionsByDate] = useState<Record<string, StudySession[]>>(
    {}
  );

  const [openSubjectsUI, setOpenSubjectsUI] = useState<Record<string, boolean>>({});
  const subjectsForSelectedDate = useMemo(
    () => mapTodosToSubjectGroups(todos, DEFAULT_SUBJECTS),
    [todos]
  );

  const studyMinutesBySubject = useMemo(() => {
    const record: Record<string, number> = {};
    for (const session of studySessions) {
      const minutes = Math.max(1, Math.ceil(session.durationSeconds / 60));
      const key = normalizeSubject(session.subject);
      record[key] = (record[key] ?? 0) + minutes;
    }
    return record;
  }, [studySessions]);

  const totalStudyMinutes = useMemo(
    () => Object.values(studyMinutesBySubject).reduce((acc, cur) => acc + cur, 0),
    [studyMinutesBySubject]
  );

  const weeklyTotalStudyMinutes = useMemo(() => {
    let total = 0;
    for (const key of Object.keys(weeklySessionsByDate)) {
      for (const session of weeklySessionsByDate[key] ?? []) {
        total += Math.max(1, Math.ceil(session.durationSeconds / 60));
      }
    }
    return total;
  }, [weeklySessionsByDate]);

  // subjects 바뀌면 전부 열림(true)으로
  useEffect(() => {
    setOpenSubjectsUI((prev) => {
      const next = { ...prev };
      for (const s of subjectsForSelectedDate) {
        if (next[s.id] === undefined) next[s.id] = true; // 기본 true
      }
      return next;
    });
  }, [subjectsForSelectedDate]);

  const toggleSubjectUI = (id: string) => {
    setOpenSubjectsUI((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openTaskDetail = (taskId: string) => {
    navigate(`/mentee/tasks/${taskId}`);
  };

  useEffect(() => {
    refetchTodos(currentDateKey).catch(console.error);
  }, [currentDateKey]);

  useEffect(() => {
    menteePlannerApi
      .getPlannerByDate(currentDateKey)
      .then((res) => {
        setMentorComment(res.data?.comment ?? "");
        setPlannerTodoCounts(res.data?.todoCounts ?? null);
      })
      .catch(() => {
        setMentorComment("");
        setPlannerTodoCounts(null);
      });
  }, [currentDateKey]);

  const plannerTotalCount = plannerTodoCounts?.total ?? totalCount;
  const plannerDoneCount = plannerTodoCounts?.completed ?? doneCount;
  const plannerProgress =
    plannerTotalCount === 0 ? 0 : Math.round((plannerDoneCount / plannerTotalCount) * 100);

  useEffect(() => {
    menteeStudySessionApi.getByDate(currentDateKey)
      .then((res) => setStudySessions(res.data))
      .catch(() => setStudySessions([]));
  }, [currentDateKey]);

  const refreshStudySessions = () => {
    menteeStudySessionApi.getByDate(currentDateKey)
      .then((res) => setStudySessions(res.data))
      .catch(() => setStudySessions([]));
  };

  useEffect(() => {
    let ignore = false;
    const fetchWeek = async () => {
      const entries = await Promise.all(
        weekDays.map(async (day) => {
          const key = toDateKey(day);
          try {
            const res = await menteeStudySessionApi.getByDate(key);
            return [key, res.data as StudySession[]] as const;
          } catch {
            return [key, [] as StudySession[]] as const;
          }
        })
      );
      if (ignore) return;
      const next: Record<string, StudySession[]> = {};
      for (const [key, sessions] of entries) {
        next[key] = sessions ?? [];
      }
      setWeeklySessionsByDate(next);
    };

    fetchWeek();
    return () => {
      ignore = true;
    };
  }, [weekDays]);

  const [addTaskError, setAddTaskError] = useState("");
  const [editTaskError, setEditTaskError] = useState("");
  const handleCreateTodo = async () => {
    const title = taskDraftText.trim();
    if (!title) {
      setAddTaskError("할일을 입력해주세요.");
      return;
    }
    if (!selectedSubject) return;
    setAddTaskError("");

    try {
      await createMenteeTodo({
        title,
        date: currentDateKey,          //  선택된 날짜
        subject: toApiSubject(selectedSubject),      //  모달에서 선택된 과목명
        goal: "",
        isCompleted: false,
      });

      //  모달 닫고 입력 초기화
      setIsModalOpen(false);
      setTaskDraftText("");

      //  다시 조회해서 화면 갱신(가장 안전)
      await refetchTodos(currentDateKey);
    } catch (e) {
      console.error(e);
    }
  };


  const refetchTodos = async (date: string) => {
    const res = await getMenteeTodos({ date });
    setTodos(res.data);
  };

  // 완료 토글 (PATCH는 전체 바디 필요)
  const handleToggleTodoDone = async (_subjectId: string, taskId: string) => {
    // taskId는 String(todo.id)였으니 number로 변환
    const todoId = Number(taskId);
    if (Number.isNaN(todoId)) return;

    // 현재 todo 찾기
    const found = todos.find((t) => t.id === todoId);
    if (!found) return;

    // 1) UI 먼저 즉시 반영(낙관적 업데이트)
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, isCompleted: !t.isCompleted } : t))
    );

    // 2) 서버 PATCH
    try {
      await patchMenteeTodo(todoId, {
        title: found.title,
        date: found.date,
        subject: toApiSubject(found.subject),
        goal: "",
        isCompleted: !found.isCompleted,
      });
    } catch (e) {
      // 실패하면 롤백
      console.error(e);
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? { ...t, isCompleted: found.isCompleted } : t))
      );
    }
  };


  //  삭제
  const handleDeleteTodo = async (task: SubjectGroup["tasks"][number]) => {
    try {
      await deleteMenteeTodo(task.todoId);
      await refetchTodos(currentDateKey);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "삭제에 실패했어요. 잠시 후 다시 시도해주세요.";
      setErrorModal({
        open: true,
        title: "삭제 실패",
        description: typeof message === "string" ? message : "삭제에 실패했어요. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  //  수정(제목 수정) - TaskActionModal의 saveTaskEdit에 연결할 예정
  const handleEditTodoTitle = async (task: SubjectGroup["tasks"][number], nextTitle: string) => {
    const todo = todos.find((t) => t.id === task.todoId);
    if (!todo) return;

    const title = nextTitle.trim();
    if (!title) return;

    await patchMenteeTodo(todo.id, {
      title,
      date: todo.date,
      subject: toApiSubject(todo.subject),
      goal: todo.goal ?? "",
      isCompleted: todo.isCompleted,
    });

    await refetchTodos(currentDateKey);
  };

  const updateTodo = async (todoId: number, patch: { date?: string }) => {
    const found = todos.find((t) => t.id === todoId);
    if (!found) return;

    //  1) UI 먼저 반영
    const prevTodo = found;
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, ...patch } : t))
    );

    //  2) 서버 PATCH (백엔드가 full body 요구하는 케이스 대비)
    try {
      await patchMenteeTodo(todoId, {
        title: prevTodo.title,
        date: patch.date ?? prevTodo.date,
        subject: toApiSubject(prevTodo.subject),
        goal: "",
        isCompleted: prevTodo.isCompleted,
      });

      // 날짜 이동이면 현재 날짜의 리스트가 바뀌니까 다시 조회(안전)
      await refetchTodos(currentDateKey);
    } catch (e) {
      console.error(e);
      // 실패 롤백
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? prevTodo : t))
      );
    }
  };

  const handleMoveTodoToTomorrow = async (_subjectId: string, taskId: string) => {
    const todoId = Number(taskId);
    if (Number.isNaN(todoId)) return;

    const found = todos.find((t) => t.id === todoId);
    if (!found) return;

    const tomorrow = addDays(found.date, 1);
    await updateTodo(todoId, { date: tomorrow });

    // 모달 닫기(너 코드에 맞게)
    setTaskActionOpen(false);
  };
  const handleChangeTodoDate = async (_subjectId: string, taskId: string, newDateKey: string) => {
    const todoId = Number(taskId);
    if (Number.isNaN(todoId)) return;

    await updateTodo(todoId, { date: newDateKey });

    // 모달 닫기(너 코드에 맞게)
    setTaskDateOpen(false);
    setTaskActionOpen(false);
  };


  function mapTodosToSubjectGroups(
    todos: MenteeTodo[],
    baseSubjects: readonly string[] = DEFAULT_SUBJECTS
  ): SubjectGroup[] {
    // 1) 기본 과목을 먼저 만들어 둠 (할 일 없어도 표시되게)
    const bySubject = new Map<string, SubjectGroup>();
    for (const name of baseSubjects) {
      bySubject.set(name, { id: name, name, tasks: [] });
    }

    // 2) todo를 subject별로 밀어넣기 (기본 과목 외 subject도 자동 추가)
    for (const todo of todos) {
      const key = normalizeSubject(todo.subject);
      if (!bySubject.has(key)) {
        bySubject.set(key, { id: key, name: key, tasks: [] });
      }

      bySubject.get(key)!.tasks.push({
        id: String(todo.id),
        todoId: todo.id,
        title: todo.title,
        done: todo.isCompleted,
        time: "0m",
        dateKey: todo.date,
        isMine: todo.isMine,
      });
    }

    return Array.from(bySubject.values());
  }



  const scrollToTop = () => {
    const scrollTarget = document.querySelector("main");
    scrollTarget?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const pickerLabel = useMemo(() => formatMonthLabel(pickerMonth), [pickerMonth]);
  const pickerGrid = useMemo(() => buildMonthGrid(pickerMonth), [pickerMonth]);

  if (recordOpen) {
    return (
      <div className="space-y-5 pb-6">
        <DailyRecordPage
          todayLabel={todayLabel}
          subjects={dailySubjects}
          dateKey={currentDateKey}
          readOnly={
            !(
              currentDate.getFullYear() === new Date().getFullYear() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getDate() === new Date().getDate()
            )
          }
          onBack={() => setRecordOpen(false)}
          onOpenDatePicker={() => {
            setPickerMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
            setDatePickerOpen(true);
          }}
          onRefreshSessions={refreshStudySessions}
        />
        <DatePickerModal
          open={datePickerOpen}
          monthLabel={pickerLabel}
          monthGrid={pickerGrid}
          currentDate={currentDate}
          onPrevMonth={() =>
            setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }
          onNextMonth={() =>
            setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }
          onSelectDate={(date) => {
            selectDateFromMonth(date);
            setDatePickerOpen(false);
          }}
          onClose={() => setDatePickerOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setViewMode("daily")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow ${viewMode === "daily"
            ? "bg-violet-600 text-white"
            : "border border-gray-300 bg-white text-gray-400"
            }`}
        >
          일일
        </button>
        <button
          type="button"
          onClick={() => setViewMode("monthly")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow ${viewMode === "monthly"
            ? "bg-violet-600 text-white"
            : "border border-gray-300 bg-white text-gray-400"
            }`}
        >
          월간
        </button>
        <button
          type="button"
          onClick={() => setViewMode("weekly")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow ${viewMode === "weekly"
            ? "bg-violet-600 text-white"
            : "border border-gray-300 bg-white text-gray-400"
            }`}
        >
          주간
        </button>
      </div>

      {viewMode === "monthly" && (
        <MonthlyView
          monthLabel={monthLabel}
          monthGrid={monthGrid}
          currentDate={currentDate}
          todayLabel={todayLabel}
          monthGoals={monthGoals}
          subjects={subjectsForSelectedDate}
          studyMinutesBySubject={studyMinutesBySubject}
          totalStudyMinutes={totalStudyMinutes}
          openSubjects={openSubjects}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onSelectDate={selectDateFromMonth}
          onAddGoal={openAddGoal}
          onToggleGoalDone={toggleGoalDone}
          onOpenGoalActions={openGoalActions}
          onAddTask={openAddTask}
          onToggleSubject={toggleSubject}
          onToggleTaskDone={handleToggleTodoDone}
          onOpenTaskActions={openTaskActions}
          getTasksForDate={getTasksForDate}
          onOpenTaskDetail={openTaskDetail}
          onGoDaily={() => {
            setViewMode("daily");
            requestAnimationFrame(scrollToTop);
          }}
          goalModalOpen={goalModalOpen}
          goalDraftTitle={goalDraftTitle}
          goalEditId={goalEditId}
          goalActionOpen={goalActionOpen}
          onChangeGoalDraftTitle={setGoalDraftTitle}
          onCloseGoalModal={() => setGoalModalOpen(false)}
          onSaveGoal={saveGoal}
          onCloseGoalAction={() => setGoalActionOpen(false)}
          onOpenEditGoal={openEditGoal}
          onDeleteGoal={deleteGoal}
        />
      )}

      {viewMode === "weekly" && (
        <WeeklyView
          weekStart={weekStart}
          weekDays={weekDays}
          currentDate={currentDate}
          subjects={subjectsForSelectedDate}
          weekTotalStudyMinutes={weeklyTotalStudyMinutes}
          openSubjects={openSubjects}
          getTasksForDate={getTasksForDate}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onSelectDate={selectDateFromMonth}
          onToggleSubject={toggleSubject}
          onAddTask={openAddTask}
          onToggleTaskDone={toggleTaskDone}
          onOpenTaskActions={openTaskActions}
          onOpenTaskDetail={openTaskDetail}
          onGoDaily={() => {
            setViewMode("daily");
            requestAnimationFrame(scrollToTop);
          }}
        />
      )}

      {viewMode === "daily" && (
        <DailyView
          todayLabel={todayLabel}
          progress={plannerProgress}
          doneCount={plannerDoneCount}
          totalCount={plannerTotalCount}
          dailyNoteText={dailyNoteText}
          subjects={subjectsForSelectedDate} //  API 기반 subjects
          studyMinutesBySubject={studyMinutesBySubject}
          totalStudyMinutes={totalStudyMinutes}
          openSubjects={openSubjectsUI}      //  우리가 만든 토글 상태
          mentorComment={mentorComment}
          onPrevDay={goToPrevDay}
          onNextDay={goToNextDay}
          onOpenDatePicker={() => {
            setPickerMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
            setDatePickerOpen(true);
          }}
          onOpenDailyNote={() => setDailyNoteOpen(true)}
          onGoMonthly={() => setViewMode("monthly")}
          onOpenRecord={() => setRecordOpen(true)}
          onToggleSubject={toggleSubjectUI}  //  우리가 만든 토글 함수
          onAddTask={openAddTask}
          onToggleTaskDone={handleToggleTodoDone} //  PATCH 연결
          onOpenTaskActions={openTaskActions}
          onOpenTaskDetail={openTaskDetail}
        />
      )}


      <AddTaskModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAddTaskError("");
        }}
        selectedSubject={selectedSubject}
        taskDraftText={taskDraftText}
        onChangeTaskDraftText={(v) => {
          setTaskDraftText(v);
          setAddTaskError("");
        }}
        onAddTask={handleCreateTodo}
        errorMessage={addTaskError}
      />


      <TaskActionModal
        open={taskActionOpen}
        onClose={() => setTaskActionOpen(false)}
        activeTask={activeTask}
        onDelete={async () => {
          if (!activeTask) return;

          const task = subjectsForSelectedDate
            .find((s) => s.id === activeTask.subjectId)
            ?.tasks.find((t) => t.id === activeTask.task.id);

          if (!task) return;

          await handleDeleteTodo(task);
          setTaskActionOpen(false);
        }}
        onOpenEdit={openTaskEdit}
        onOpenDate={openTaskDate}
        onMoveTomorrow={() => {
          if (!activeTask) return;
          handleMoveTodoToTomorrow(activeTask.subjectId, activeTask.task.id);
        }}

        taskEditOpen={taskEditOpen}
        taskDraftTitle={taskDraftTitle}
        onChangeTaskDraftTitle={(v) => {
          setTaskDraftTitle(v);
          setEditTaskError("");
        }}
        onSaveTaskEdit={async () => {
          if (!activeTask) return;

          const task = subjectsForSelectedDate
            .find((s) => s.id === activeTask.subjectId)
            ?.tasks.find((t) => t.id === activeTask.task.id);

          if (!task) return;

          const title = taskDraftTitle.trim();
          if (!title) {
            setEditTaskError("할일을 입력해주세요.");
            return;
          }
          setEditTaskError("");
          await handleEditTodoTitle(task, taskDraftTitle);
          setTaskEditOpen(false);
          setTaskActionOpen(false);
        }}
        onCloseTaskEdit={() => {
          setTaskEditOpen(false);
          setEditTaskError("");
        }}
        editTaskError={editTaskError}

        // 날짜/내일로/시간설정은 API 스펙 더 보고 다음으로!
        taskDateOpen={taskDateOpen}
        taskDraftDate={taskDraftDate}
        onChangeTaskDraftDate={setTaskDraftDate}
        onSaveTaskDate={() => {
          if (!activeTask) return;
          // taskDraftDate가 "YYYY-MM-DD" 형태라고 가정
          handleChangeTodoDate(activeTask.subjectId, activeTask.task.id, taskDraftDate);
        }}

        onCloseTaskDate={() => setTaskDateOpen(false)}
      />


      <DailyNoteModal
        open={dailyNoteOpen}
        noteText={dailyNoteText}
        onClose={() => setDailyNoteOpen(false)}
        onChangeNoteText={setDailyNoteText}
        onSave={saveDailyNote}
      />

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

      <DatePickerModal
        open={datePickerOpen}
        monthLabel={pickerLabel}
        monthGrid={pickerGrid}
        currentDate={currentDate}
        onPrevMonth={() =>
          setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
        }
        onNextMonth={() =>
          setPickerMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
        }
        onSelectDate={(date) => {
          selectDateFromMonth(date);
          setDatePickerOpen(false);
        }}
        onClose={() => setDatePickerOpen(false)}
      />

    </div>
  );
}
