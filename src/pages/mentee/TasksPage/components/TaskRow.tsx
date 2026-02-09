import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/cn";
import type { TaskItem } from "../types/tasks";

interface TaskRowProps {
  task: TaskItem;
}

const statusConfig = {
  done: {
    label: "완료",
    className: "bg-emerald-100 text-emerald-600",
  },
  pending: {
    label: "미완료",
    className: "bg-gray-200 text-gray-500",
  },
} as const;

export default function TaskRow({ task }: TaskRowProps) {
  const status = statusConfig[task.status];
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/mentee/tasks/${task.id}`)}
      className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-violet-200 hover:shadow-md"
      aria-label={`${task.title} 상세 보기`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        {task.title}
        {task.isMine === false && (
          <span className="rounded-full bg-amber-100 px-1.5 py-0 text-[9px] font-semibold text-amber-700">
            멘토
          </span>
        )}
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          status.className
        )}
      >
        {status.label}
      </span>
    </button>
  );
}
