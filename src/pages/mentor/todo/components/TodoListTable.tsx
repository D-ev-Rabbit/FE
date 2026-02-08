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
  onClickItem?: (todo: TodoItem) => void;
}

const subjectLabel = (s: TodoItem["subject"]) =>
  s === "KOREAN" ? "국어" : s === "ENGLISH" ? "영어" : "수학"

const subjectBadgeClass = (s: TodoItem["subject"]) => {
  if (s === "KOREAN") return "bg-yellow-100 text-yellow-800 ring-yellow-200";
  if (s === "ENGLISH") return "bg-rose-100 text-rose-800 ring-rose-200";
  return "bg-indigo-100 text-indigo-800 ring-indigo-200";
};

export default function TodoListTable({ items, onToggleDone: _onToggleDone, onClickRow, className }: Props) {
  return (
    <div className={clsx("rounded-2xl border border-gray-200 bg-white", className)}>
      <div className="max-h-[420px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-5 p-5 text-sm text-gray-500">해당 날짜/과목의 과제가 없어요.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((t) => (
              <li key={t.id} className="px-5 py-4">
                <div className="flex items-start gap-3 ">
                  

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

                      <span
                        className={clsx(
                          "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          subjectBadgeClass(t.subject)
                        )}
                      >
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
