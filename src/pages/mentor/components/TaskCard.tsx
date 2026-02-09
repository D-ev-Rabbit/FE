import { useNavigate } from "react-router-dom"

type TaskCardItem = {
  menteeId: number
  date: string
  todoId: number
  subject: "KOREAN" | "ENGLISH" | "MATH"
  title: string
  feedbackDone: boolean
}

export function TaskCard({ item }: { item: TaskCardItem }) {
  const navigate = useNavigate()

  const onClick = () => {
    const params = new URLSearchParams({ todoId: String(item.todoId) })
    navigate(`/mentor/feedback/${item.menteeId}/${item.date}?${params.toString()}`)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border border-gray-200 p-4 bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-500">{item.subject}</div>
          <div className="font-medium">{item.title}</div>
        </div>

        <span
          className={[
            "shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
            item.feedbackDone
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-gray-50 text-gray-600 ring-gray-200",
          ].join(" ")}
        >
          {item.feedbackDone ? "피드백 완료" : "피드백 대기"}
        </span>
      </div>
    </button>
  )
}
