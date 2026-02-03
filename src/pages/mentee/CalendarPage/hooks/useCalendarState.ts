import { useMemo, useState } from "react";
import type { MonthGoal, SubjectGroup, Task, ViewMode } from "../types/calendar";
import {
  addDays,
  buildMonthGrid,
  formatDate,
  formatDateInput,
  formatMonthLabel,
  parseDateInput,
} from "../utils/date";

const INITIAL_SUBJECTS: SubjectGroup[] = [
  {
    id: "kor",
    name: "국어",
    tasks: [],
  },
  {
    id: "eng",
    name: "영어",
    tasks: [],
  },
  {
    id: "math",
    name: "수학",
    tasks: [],
  },
];

const INITIAL_GOALS: MonthGoal[] = [];

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const WEEKLY_REPEAT_COUNT = 8;
const WEEKDAY_TO_INDEX: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

export default function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [subjects, setSubjects] = useState<SubjectGroup[]>(INITIAL_SUBJECTS);
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>(
    () => INITIAL_SUBJECTS.reduce((acc, cur) => ({ ...acc, [cur.id]: true }), {})
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("국어");
  const [taskDraftText, setTaskDraftText] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState<"weekly" | "once">("weekly");
  const [taskActionOpen, setTaskActionOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<{ subjectId: string; task: Task } | null>(
    null
  );
  const [taskEditOpen, setTaskEditOpen] = useState(false);
  const [taskDraftTitle, setTaskDraftTitle] = useState("");
  const [taskDateOpen, setTaskDateOpen] = useState(false);
  const [taskDraftDate, setTaskDraftDate] = useState("");
  const [monthGoals, setMonthGoals] = useState<MonthGoal[]>(INITIAL_GOALS);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalDraftTitle, setGoalDraftTitle] = useState("");
  const [goalEditId, setGoalEditId] = useState<string | null>(null);
  const [goalActionOpen, setGoalActionOpen] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [dailyNoteOpen, setDailyNoteOpen] = useState(false);
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>({});

  const currentDateKey = useMemo(() => formatDateInput(currentDate), [currentDate]);
  const dailyNoteText = dailyNotes[currentDateKey] ?? "";

  const todayLabel = useMemo(() => formatDate(currentDate), [currentDate]);
  const monthLabel = useMemo(() => formatMonthLabel(currentMonth), [currentMonth]);
  const monthGrid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  const getSubjectsForDate = (date: Date) => {
    const target = formatDateInput(date);
    return subjects.map((subject) => ({
      ...subject,
      tasks: subject.tasks.filter((task) => task.date === target),
    }));
  };

  const dailySubjects = useMemo(
    () => getSubjectsForDate(currentDate),
    [subjects, currentDate]
  );

  const totalCount = useMemo(
    () => dailySubjects.reduce((acc, cur) => acc + cur.tasks.length, 0),
    [dailySubjects]
  );

  const doneCount = useMemo(
    () =>
      dailySubjects.reduce(
        (acc, cur) => acc + cur.tasks.filter((task) => task.done).length,
        0
      ),
    [dailySubjects]
  );

  const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const weekStart = useMemo(
    () => addDays(currentDate, -currentDate.getDay()),
    [currentDate]
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart]
  );

  const toggleSubject = (id: string) => {
    setOpenSubjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddTask = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setTaskDraftText("");
    setSelectedWeekdays([]);
    setRepeatMode("weekly");
    setIsModalOpen(true);
  };

  const saveDailyNote = () => {
    setDailyNotes((prev) => ({ ...prev, [currentDateKey]: dailyNoteText }));
    setDailyNoteOpen(false);
  };

  const addTask = () => {
    const title = taskDraftText.trim();
    if (!title) return;
    const selectedDays =
      selectedWeekdays.length > 0
        ? selectedWeekdays
        : [WEEKDAYS[(currentDate.getDay() + 6) % 7]];
    const weekStartDate = addDays(currentDate, -currentDate.getDay());
    const offsets = selectedDays
      .map((day) => WEEKDAY_TO_INDEX[day])
      .filter((value) => value !== undefined);
    const targetDates =
      repeatMode === "weekly"
        ? Array.from({ length: WEEKLY_REPEAT_COUNT }, (_, weekIndex) =>
            offsets.map((offset) => addDays(weekStartDate, weekIndex * 7 + offset))
          ).flat()
        : offsets.map((offset) => addDays(weekStartDate, offset));
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.name !== selectedSubject) return subject;
        return {
          ...subject,
          tasks: [
            ...targetDates.map((date) => ({
              id: `task-${Date.now()}-${date.getTime()}`,
              title,
              date: formatDateInput(date),
            })),
            ...subject.tasks,
          ],
        };
      })
    );
    setIsModalOpen(false);
  };

  const goToPrevDay = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  };

  const goToNextDay = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  };

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectDateFromMonth = (date: Date) => {
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const openTaskActions = (subjectId: string, task: Task) => {
    setActiveTask({ subjectId, task });
    setTaskActionOpen(true);
  };

  const toggleTaskDone = (subjectId: string, taskId: string) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id !== subjectId) return subject;

        const updated = subject.tasks.map((task) => {
          const isTarget =
            task.id === taskId && task.date === currentDateKey;
          return isTarget ? { ...task, done: !task.done } : task;
        });

        const active = updated.filter((task) => !task.done);
        const completed = updated.filter((task) => task.done);

        return { ...subject, tasks: [...active, ...completed] };
      })
    );
  };

  const updateTask = (subjectId: string, taskId: string, updater: (task: Task) => Task) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id !== subjectId) return subject;
        const updated = subject.tasks.map((task) => (task.id === taskId ? updater(task) : task));
        return { ...subject, tasks: updated };
      })
    );
  };

  const deleteTask = (subjectId: string, taskId: string) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id !== subjectId) return subject;
        return { ...subject, tasks: subject.tasks.filter((task) => task.id !== taskId) };
      })
    );
  };

  const openTaskEdit = () => {
    if (!activeTask) return;
    setTaskDraftTitle(activeTask.task.title);
    setTaskEditOpen(true);
    setTaskActionOpen(false);
  };

  const saveTaskEdit = () => {
    if (!activeTask) return;
    updateTask(activeTask.subjectId, activeTask.task.id, (task) => ({
      ...task,
      title: taskDraftTitle.trim() || task.title,
    }));
    setTaskEditOpen(false);
  };

  const openTaskDate = () => {
    if (!activeTask) return;
    const base = activeTask.task.date ? parseDateInput(activeTask.task.date) : currentDate;
    setTaskDraftDate(formatDateInput(base));
    setTaskDateOpen(true);
    setTaskActionOpen(false);
  };

  const saveTaskDate = () => {
    if (!activeTask || !taskDraftDate) return;
    updateTask(activeTask.subjectId, activeTask.task.id, (task) => ({
      ...task,
      date: taskDraftDate,
    }));
    setCurrentDate(parseDateInput(taskDraftDate));
    setTaskDateOpen(false);
  };

  const moveTaskToTomorrow = () => {
    if (!activeTask) return;
    const base = activeTask.task.date ? parseDateInput(activeTask.task.date) : currentDate;
    const next = addDays(base, 1);
    const nextValue = formatDateInput(next);

    updateTask(activeTask.subjectId, activeTask.task.id, (task) => ({
      ...task,
      date: nextValue,
    }));

    setCurrentDate(next);
    setTaskActionOpen(false);
  };

  const goToPrevWeek = () => {
    const prev = addDays(weekStart, -7);
    setCurrentDate(prev);
    setCurrentMonth(new Date(prev.getFullYear(), prev.getMonth(), 1));
  };

  const goToNextWeek = () => {
    const next = addDays(weekStart, 7);
    setCurrentDate(next);
    setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  const openAddGoal = () => {
    setGoalDraftTitle("");
    setGoalEditId(null);
    setGoalModalOpen(true);
  };

  const openGoalActions = (goalId: string) => {
    setActiveGoalId(goalId);
    setGoalActionOpen(true);
  };

  const openEditGoal = () => {
    if (!activeGoalId) return;
    const goal = monthGoals.find((item) => item.id === activeGoalId);
    if (!goal) return;
    setGoalDraftTitle(goal.title);
    setGoalEditId(goal.id);
    setGoalModalOpen(true);
    setGoalActionOpen(false);
  };

  const saveGoal = () => {
    const title = goalDraftTitle.trim();
    if (!title) return;

    if (goalEditId) {
      setMonthGoals((prev) =>
        prev.map((goal) => (goal.id === goalEditId ? { ...goal, title } : goal))
      );
    } else {
      setMonthGoals((prev) => [...prev, { id: `goal-${Date.now()}`, title, done: false }]);
    }
    setGoalModalOpen(false);
  };

  const toggleGoalDone = (goalId: string) => {
    setMonthGoals((prev) => {
      const updated = prev.map((goal) =>
        goal.id === goalId ? { ...goal, done: !goal.done } : goal
      );
      const active = updated.filter((goal) => !goal.done);
      const completed = updated.filter((goal) => goal.done);
      return [...active, ...completed];
    });
  };

  const deleteGoal = () => {
    if (!activeGoalId) return;
    setMonthGoals((prev) => prev.filter((goal) => goal.id !== activeGoalId));
    setGoalActionOpen(false);
  };

  const getTasksForDate = (date: Date) => {
    const target = formatDateInput(date);
    return subjects.flatMap((subject) =>
      subject.tasks
        .filter((task) => task.date === target)
        .map((task) => ({ ...task, subject: subject.name }))
    );
  };

  return {
    currentDate,
    currentMonth,
    currentDateKey,
    viewMode,
    dailySubjects,
    subjects,

    openSubjects,
    isModalOpen,
    selectedSubject,
    taskDraftText,
    selectedWeekdays,
    repeatMode,
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
    progress,
    weekStart,
    weekDays,
    weekdays: WEEKDAYS,

    setViewMode,
    setIsModalOpen,
    setSelectedWeekdays,
    setRepeatMode,
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
    setDailyNoteText: (value: string) =>
      setDailyNotes((prev) => ({ ...prev, [currentDateKey]: value })),

    toggleSubject,
    openAddTask,
    addTask,
    goToPrevDay,
    goToNextDay,
    goToPrevMonth,
    goToNextMonth,
    selectDateFromMonth,
    toggleWeekday,
    openTaskActions,
    toggleTaskDone,
    deleteTask,
    openTaskEdit,
    saveTaskEdit,
    openTaskDate,
    saveTaskDate,
    moveTaskToTomorrow,
    goToPrevWeek,
    goToNextWeek,
    openAddGoal,
    openGoalActions,
    openEditGoal,
    saveGoal,
    toggleGoalDone,
    deleteGoal,
    getTasksForDate,
    getSubjectsForDate,
    saveDailyNote,
  };
}
