import { useMemo, useState } from "react";
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

export default function MenteeCalendarPage() {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(() => new Date());
  const {
    currentDate,
    viewMode,
    dailySubjects,
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
    weekdays,
    setViewMode,
    setIsModalOpen,
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
    setDailyNoteText,
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
  } = useCalendarState();

  const subjectsForSelectedDate = getSubjectsForDate(currentDate);
  const pickerLabel = useMemo(() => formatMonthLabel(pickerMonth), [pickerMonth]);
  const pickerGrid = useMemo(() => buildMonthGrid(pickerMonth), [pickerMonth]);

  if (recordOpen) {
    return (
      <div className="space-y-5 pb-6">
        <DailyRecordPage
          todayLabel={todayLabel}
          subjects={dailySubjects}
          onBack={() => setRecordOpen(false)}
          onOpenDatePicker={() => {
            setPickerMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
            setDatePickerOpen(true);
          }}
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
            className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow ${
              viewMode === "daily"
                ? "bg-violet-600 text-white"
                : "border border-gray-300 bg-white text-gray-400"
            }`}
          >
            일일
          </button>
          <button
            type="button"
            onClick={() => setViewMode("monthly")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow ${
              viewMode === "monthly"
                ? "bg-violet-600 text-white"
                : "border border-gray-300 bg-white text-gray-400"
            }`}
          >
            월간
          </button>
          <button
            type="button"
            onClick={() => setViewMode("weekly")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow ${
              viewMode === "weekly"
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
          openSubjects={openSubjects}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onSelectDate={selectDateFromMonth}
          onAddGoal={openAddGoal}
          onToggleGoalDone={toggleGoalDone}
          onOpenGoalActions={openGoalActions}
          onAddTask={openAddTask}
          onToggleSubject={toggleSubject}
          onToggleTaskDone={toggleTaskDone}
          onOpenTaskActions={openTaskActions}
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
          openSubjects={openSubjects}
          getTasksForDate={getTasksForDate}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onSelectDate={selectDateFromMonth}
          onToggleSubject={toggleSubject}
          onAddTask={openAddTask}
          onToggleTaskDone={toggleTaskDone}
          onOpenTaskActions={openTaskActions}
        />
      )}

      {viewMode === "daily" && (
        <DailyView
          todayLabel={todayLabel}
          progress={progress}
          doneCount={doneCount}
          totalCount={totalCount}
          dailyNoteText={dailyNoteText}
          subjects={dailySubjects}   /* ✅ 필터된 데이터 */
          openSubjects={openSubjects}
          onPrevDay={goToPrevDay}
          onNextDay={goToNextDay}
          onOpenDatePicker={() => {
            setPickerMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
            setDatePickerOpen(true);
          }}
          onOpenDailyNote={() => setDailyNoteOpen(true)}
          onGoMonthly={() => setViewMode("monthly")}
          onOpenRecord={() => setRecordOpen(true)}
          onToggleSubject={toggleSubject}
          onAddTask={openAddTask}
          onToggleTaskDone={toggleTaskDone}
          onOpenTaskActions={openTaskActions}
        />
      )}

      <AddTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSubject={selectedSubject}
        taskDraftText={taskDraftText}
        weekdays={weekdays}
        selectedWeekdays={selectedWeekdays}
        repeatMode={repeatMode}
        onToggleWeekday={toggleWeekday}
        onSetRepeatMode={setRepeatMode}
        onChangeTaskDraftText={setTaskDraftText}
        onAddTask={addTask}
      />

      <TaskActionModal
        open={taskActionOpen}
        onClose={() => setTaskActionOpen(false)}
        activeTask={activeTask}
        onDelete={() => {
          if (!activeTask) return;
          deleteTask(activeTask.subjectId, activeTask.task.id);
          setTaskActionOpen(false);
        }}
        onOpenEdit={openTaskEdit}
        onOpenDate={openTaskDate}
        onMoveTomorrow={moveTaskToTomorrow}
        taskEditOpen={taskEditOpen}
        taskDraftTitle={taskDraftTitle}
        onChangeTaskDraftTitle={setTaskDraftTitle}
        onSaveTaskEdit={saveTaskEdit}
        onCloseTaskEdit={() => setTaskEditOpen(false)}
        taskDateOpen={taskDateOpen}
        taskDraftDate={taskDraftDate}
        onChangeTaskDraftDate={setTaskDraftDate}
        onSaveTaskDate={saveTaskDate}
        onCloseTaskDate={() => setTaskDateOpen(false)}
      />

      <DailyNoteModal
        open={dailyNoteOpen}
        noteText={dailyNoteText}
        onClose={() => setDailyNoteOpen(false)}
        onChangeNoteText={setDailyNoteText}
        onSave={saveDailyNote}
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
