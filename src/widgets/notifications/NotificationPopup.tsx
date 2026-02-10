import { cn } from "@/shared/lib/cn";
import { HiOutlineX } from "react-icons/hi";
import type { Notice } from "./types";
import { FiBookOpen, FiAlertCircle, FiMessageSquare, FiFileText } from "react-icons/fi";
import type React from "react";
import type { NotificationType } from "@/types/notification";

const typeMeta: Record<NotificationType, { label: string }> = {
  TODO_COMMENT: { label: "과제 코멘트" },
  FILE_FEEDBACK: { label: "파일 피드백" },
  PLANNER_COMMENT: { label: "플래너 피드백" },
  TODO_INCOMPLETE: { label: "과제 미제출" },
};

const typeStyle: Record<
  NotificationType,
  { bg: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  TODO_COMMENT: { bg: "bg-violet-500", Icon: FiMessageSquare },
  FILE_FEEDBACK: { bg: "bg-indigo-500", Icon: FiFileText },
  PLANNER_COMMENT: { bg: "bg-green-500", Icon: FiBookOpen },
  TODO_INCOMPLETE: { bg: "bg-red-500", Icon: FiAlertCircle },
};

const replaceSubjectInMessage = (msg: string) =>
  msg
    .replaceAll("KOREAN", "국어")
    .replaceAll("ENGLISH", "영어")
    .replaceAll("MATH", "수학");

function groupByType(list: Notice[]) {
  const grouped: Record<NotificationType, Notice[]> = {
    TODO_COMMENT: [],
    FILE_FEEDBACK: [],
    PLANNER_COMMENT: [],
    TODO_INCOMPLETE: [],
  };
  list.forEach((n) => grouped[n.type].push(n));
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
  notices,
  onNoticeClick,
}: Props) {
  if (!open) return null;

  const safeNotices = notices ?? [];
  const grouped = groupByType(safeNotices);
  const totalCount = safeNotices.length;

  const orderedTypes: NotificationType[] = [
    "TODO_COMMENT",
    "FILE_FEEDBACK",
    "PLANNER_COMMENT",
    "TODO_INCOMPLETE",
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
          {totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-2 text-sm font-semibold text-gray-800">새 알림이 없어요</div>
              <div className="text-xs text-gray-500">도착하면 여기에서 확인할 수 있어요</div>
            </div>
          ) : (
            <div className="space-y-7">
              {orderedTypes.map((type) => {
                const list = grouped[type];
                if (list.length === 0) return null;

                const meta = typeMeta[type];

                return (
                  <div key={type}>
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
                        const { bg, Icon } = typeStyle[n.type];

                        return (
                          <li key={n.id ?? `${n.type}-${n.title}-${n.timeLabel}`}>
                            <button
                              type="button"
                              onClick={() => {
                                onNoticeClick?.(n); 
                                onClose();
                              }}
                              className={cn(
                                "btn-none w-full text-left",
                                "flex items-center gap-3 rounded-2xl bg-gray-50 px-1 py-3",
                                "hover:bg-gray-100 active:bg-gray-100"
                              )}
                            >
                              {/* circle icon */}
                              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", bg)}>
                                <Icon className="h-4.5 w-4.5 text-white" />
                              </div>

                              {/* text */}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900">{replaceSubjectInMessage(n.title)}</p>
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
          )}

          <div className="h-3" />
        </div>
      </section>
    </>
  );
}
