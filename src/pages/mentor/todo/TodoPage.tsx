import MenteeCard from "@/shared/ui/card/MenteeCard";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mentees as mockMentees, statusByMenteeId } from "../home/data/mock";
import TodoListTable, { type TodoItem } from "./components/TodoListTable"
import SubjectFilter, {type Subject} from "../components/subjectFilter";
import CalendarPopover from "../components/CalendarPopover";
import AddTodoCard from "./components/AddTodoCard";
import TodoEditModal from "./components/TodoEditModal";

const mockTodos: TodoItem[] = [
  { id: 1, title: "비문학 3지문", subject: "KOREAN", date: "2026-02-05", done: false },
  { id: 2, title: "단어 50개", subject: "ENGLISH", date: "2026-02-05", done: true },
  { id: 3, title: "미적분 10문제", subject: "MATH", date: "2026-02-05", done: false },
]

export default function MentorTodoPage(){
  const navigate = useNavigate();
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>("1")
  const [subject, setSubject] = useState<Subject>("ALL")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-02-05"))
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos)
  
  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
    selectedDate.getDate()
  ).padStart(2, "0")}`
  const selectedStatus = useMemo(
    () => (selectedMenteeId ? statusByMenteeId[selectedMenteeId] : null),
    [selectedMenteeId]
  );
  const filteredTodos = useMemo(() => {
    const base = todos.filter((t) => t.date === selectedDateStr)
    if (subject === "ALL") return base
    return base.filter((t) => t.subject === subject)
  }, [todos, selectedDateStr, subject])

  const toggleDone = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  //todoModal
  const [editOpen, setEditOpen] = useState(false)
  const [editMode, setEditMode] = useState<"create" | "edit">("create")
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)

  // 할일 추가
  const openCreate = () => {
    setEditMode("create")
    setEditingTodo(null)
    setEditOpen(true)
  }
// 수정
  const openEdit = (t: TodoItem) => {
    setEditMode("edit")
    setEditingTodo(t)
    setEditOpen(true)
  }

  //저장 로직
  const saveTodo = ({ title, date, subject }: { title: string; date: string; subject: TodoItem["subject"] }) => {
    if (editMode === "create") {
      const newItem: TodoItem = {
        id: Date.now(),          // 더미용 unique id
        title,
        date,
        subject, 
        done: false,
      }
      setTodos((prev) => [newItem, ...prev])
    } else if (editingTodo) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingTodo.id ? { ...t, title, date } : t))
      )
    }
    setEditOpen(false)
  }

  //삭제 로직
  const deleteTodo = () => {
    if (!editingTodo) return
    setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id))
    setEditOpen(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">HOME</h1>

      {/* 멘티 목록 */}
      <section className="space-y-3 max-w-[1250px]">
        <h2 className="text-lg font-semibold">멘티 목록</h2>
        <div className="overflow-x-auto p-4">
          <div className="flex gap-4">
            {(mockMentees ?? []).map((m) => (
              <MenteeCard
                key={m.id}
                variant="pc"  
                name={m.name}
                grade={m.grade}
                selected={m.id === selectedMenteeId}
                onClick={() => setSelectedMenteeId(m.id)}
              />
            ))}
          </div>
        </div>
      </section>
      {/* 과목필터 */}
      <div className=" bg-white p-4">
        <SubjectFilter value={subject} onChange={setSubject}/>
      </div>
      {/* 멘티 선택시 섹션 */}
      {selectedMenteeId && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* 달력 */}
          <section className="space-y-4 min-h-[520px]">
            <div className="bg-white p-4 min-w-[400px] ">
              <CalendarPopover
                selected={selectedDate}
                onSelect={(d)=> setSelectedDate(d)}
                onClose={() => {}}
              />
            </div>
          </section>
          {/* TodoList Table */}
          <section className="bg-white p-4 max-w-[880px]">
            <TodoListTable items={filteredTodos} onToggleDone={toggleDone} />

            <div className="mt-4">
              <AddTodoCard
                onAdd={openCreate}
                onOpenTemplate={() => {
                  console.log("open template")
                }}
              />

              <TodoEditModal
                open={editOpen}
                mode={editMode}
                initial={editingTodo}
                onClose={() => setEditOpen(false)}
                onSave={saveTodo}
                onDelete={editMode === "edit" ? deleteTodo : undefined}
              />
            </div>

          </section>
        </div>
      )}

      
    </div>
  );
}

