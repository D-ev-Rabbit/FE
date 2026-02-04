import clsx from "clsx"

export type TodoItem = {
  id: number
  title: string
  subject: "KOREAN" | "ENGLISH" | "MATH"
  date: string // "YYYY-MM-DD"
  done: boolean
}

type Props = {
  items: TodoItem[]
  onToggleDone?: (id: number) => void
  onClickRow?: (item: TodoItem) => void
  className?: string
}

const subjectLabel = (s: TodoItem["subject"]) =>
  s === "KOREAN" ? "국어" : s === "ENGLISH" ? "영어" : "수학"

export default function TodoListTable({ items, onToggleDone, onClickRow, className }: Props) {
  return (
    <div className={clsx("rounded-2xl border border-gray-200 bg-white", className)}>
      <div className="px-5 py-4">
        <div className="text-sm font-extrabold text-gray-900">To do List</div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-5 pb-5 text-sm text-gray-500">해당 날짜/과목의 과제가 없어요.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((t) => (
              <li key={t.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  {/* 체크 */}
                  <button
                    type="button"
                    onClick={() => onToggleDone?.(t.id)}
                    className={clsx(
                      "mt-0.5 h-10 w-3 shrink-0 rounded border transition",
                      t.done ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"
                    )}
                    aria-label={t.done ? "완료 해제" : "완료로 변경"}
                  >
                    {t.done && <span className="block h-full w-full text-center text-[12px] leading-5 text-white">✓</span>}
                  </button>

                  {/* 텍스트 */}
                  <button
                    type="button"
                    onClick={() => onClickRow?.(t)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className={clsx("font-medium", t.done && "line-through text-gray-400")}>
                        {t.title}
                      </div>

                      <span className="shrink-0 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
                        {subjectLabel(t.subject)}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-gray-500">{t.date}</div>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 하단 입력/액션 영역 필요하면 여기 추가 가능 */}
    </div>
  )
}
