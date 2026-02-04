import { cn } from "@/shared/lib/cn";
import { HiOutlineX } from "react-icons/hi";
import type { Notice, NoticeCategory } from "./types";
import { mockNotices } from "./mock";
import { FiBookOpen, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import type React from "react";

const categoryMeta: Record<NoticeCategory, { label: string }> = {
  task_feedback: { label: "과제 피드백" },
  planner_feedback: { label: "플래너 피드백" },
  task_missing: { label: "과제 미제출" },
};

const categoryStyle: Record<
  NoticeCategory,
  { bg: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  task_feedback: { bg: "bg-violet-500", Icon: FiCheckCircle },
  planner_feedback: { bg: "bg-green-500", Icon: FiBookOpen },
  task_missing: { bg: "bg-red-500", Icon: FiAlertCircle },
};

function groupByCategory(list: Notice[]) {
  const grouped: Record<NoticeCategory, Notice[]> = {
    task_feedback: [],
    planner_feedback: [],
    task_missing: [],
  };
  list.forEach((n) => grouped[n.category].push(n));
  return grouped;
}

type Props = {
  open: boolean;
  onClose: () => void;
  className?: string;
  notices?: Notice[];
  onNoticeClick?: (notice: Notice) => void;
};

export default function NotificationPopup({
  open,
  onClose,
  className,
  notices = mockNotices,
  onNoticeClick,
}: Props) {
  if (!open) return null;

  const grouped = groupByCategory(notices);

  const orderedCategories: NoticeCategory[] = [
    "task_feedback",
    "planner_feedback",
    "task_missing",
  ];

  return (
    <>
      {/* dim */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} aria-hidden />

      {/* panel */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="알림"
        className={cn(
          "fixed left-1/2 top-24 z-50 -translate-x-1/2",
          "w-[86vw] max-w-[360px] sm:max-w-[380px]",
          "rounded-[24px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] overflow-hidden",
          className
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-2.5">
          <h2 className="text-sm font-extrabold text-gray-900">알림</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="btn-none flex items-center justify-center rounded-full bg-transparent text-gray-700"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-gray-200" />

        {/* content */}
        <div className="max-h-[56vh] overflow-y-auto px-5 py-4">
          <div className="space-y-7">
            {orderedCategories.map((cat) => {
              const list = grouped[cat];
              if (list.length === 0) return null;

              const meta = categoryMeta[cat];

              return (
                <div key={cat}>
                  {/* section title */}
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span>{meta.label}</span>
                    <span className="text-[11px] font-semibold text-gray-400">
                      {list.length}
                    </span>
                  </div>

                  {/* items */}
                  <ul className="space-y-3">
                    {list.map((n) => {
                      const { bg, Icon } = categoryStyle[n.category];

                      return (
                        <li key={n.id ?? `${n.category}-${n.title}-${n.timeLabel}`}>
                          <button
                            type="button"
                            onClick={() => {
                              onNoticeClick?.(n); 
                              onClose();
                            }}
                            className={cn(
                              "btn-none w-full text-left",
                              "flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3",
                              "hover:bg-gray-100 active:bg-gray-100"
                            )}
                          >
                            {/* circle icon */}
                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", bg)}>
                              <Icon className="h-4.5 w-4.5 text-white" />
                            </div>

                            {/* text */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900">{n.title}</p>
                              <p className="mt-1 text-xs text-gray-500">{n.timeLabel}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="h-3" />
        </div>
      </section>
    </>
  );
}
