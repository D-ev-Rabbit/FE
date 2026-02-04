import { FiPlus, FiFileText } from "react-icons/fi"

type Props = {
  onAdd?: () => void
  onOpenTemplate?: () => void
}

export default function AddTodoCard({ onAdd, onOpenTemplate }: Props) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            
            <span className="text-gray-700">✍️</span>
            <span className="inline-flex h-5 w-3 items-center justify-center rounded  bg-white" />
          </div>

          {/* text */}
          <div>
            <div className="text-sm font-semibold text-gray-900">추가할 할일을 작성하세요</div>
            <div className="mt-1 text-xs text-gray-500">마감일</div>
          </div>
        </div>

        {/* right actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="할 일 추가"
          >
            <FiPlus className="h-5 w-5" />
          </button>

        </div>
      </div>
    </div>
  )
}
