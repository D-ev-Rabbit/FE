import { FiPlus } from "react-icons/fi"
import { cn } from "@/shared/lib/cn";


type Props = {
  onAdd?: () => void
  onOpenTemplate?: () => void
  className?: string
}

export default function AddTodoCard({ onAdd, onOpenTemplate: _onOpenTemplate, className }: Props) {
  return (

    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "group w-full rounded-full border border-violet-200 bg-violet-50 px-4 py-1",
        "flex items-center justify-between gap-2",
        "text-[11px] font-semibold text-violet-700",
        "transition hover:bg-violet-100",
        className
      )}
      aria-label="할 일 추가"
    >
      <span>할 일 추가</span>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-300 text-violet-400 group-hover:text-gray-600">
        <FiPlus className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}
