import { FiPlus } from "react-icons/fi"
import { FaPen } from "react-icons/fa";


type Props = {
  onAdd?: () => void
  onOpenTemplate?: () => void
}

export default function AddTodoCard({ onAdd, onOpenTemplate: _onOpenTemplate }: Props) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-700"><FaPen/></span>
            <span className="inline-flex h-5 w-3 items-center justify-center rounded  bg-white" />
          </div>

          {/* text */}
          <div>
            <div className="text-sm font-semibold text-gray-900">할 일을 추가해 보세요.</div>
          </div>
        </div>

        {/* right actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="할 일 추가"
          >
            <FiPlus className="h-5 w-5" />
          </button>

        </div>
      </div>
    </div>
  )
}
