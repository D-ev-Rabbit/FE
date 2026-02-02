import { cn } from "@/shared/lib/cn";
import { HiOutlineX } from "react-icons/hi";
import type { Notice, NoticeCategory } from "./types";
import { mockNotices } from "./mock";
import { FiBookOpen, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
import { RiInformationLine } from "react-icons/ri";

const categoryStyle: Record<
  NoticeCategory,
  { label: string; bg: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  task: {
    label: "과제",
    bg: "bg-blue-500",
    Icon: FiBookOpen,
  },
  todo: {
    label: "할 일",
    bg: "bg-green-500",
    Icon: FiCheckCircle,
  },
  feedback: {
    label: "피드백",
    bg: "bg-violet-500",
    Icon: FiMessageCircle,
  },
  system: {
    label: "안내",
    bg: "bg-gray-500",
    Icon: RiInformationLine,
  },
};

const categoryMeta: Record<NoticeCategory, { label: string; }> = {
  task: { label: "과제" },
  todo: { label: "할 일" },
  feedback: { label: "피드백" },
  system: { label: "안내" },
};

type Props = {
  open: boolean;
  onClose: () => void;
  className?: string;
  notices?: Notice[];
};

function groupByCategory(list: Notice[]) {
  const grouped: Record<NoticeCategory, Notice[]> = {
    task: [],
    todo: [],
    feedback: [],
    system: [],
  };
  list.forEach((n) => grouped[n.category].push(n));
  return grouped;
}

export default function NotificationPopup({
  open,
  onClose,
  className,
  notices = mockNotices,
}: Props) {
  if (!open) return null;

  const grouped = groupByCategory(notices);

  return (
    <>
      {/* dim */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden
      />

      {/* panel */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="알림"
        className={cn(
          "fixed left-1/2 top-24 z-50 w-[90%] max-w-[420px] -translate-x-1/2",
          "rounded-[28px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
          "overflow-hidden",
          className
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-2">
          <h2 className="text-base font-extrabold text-gray-900">알림</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center justify-center rounded-full bg-transparent text-gray-700"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-gray-200" />

        {/* content (scroll only here) */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <div className="space-y-8">
            {(Object.keys(grouped) as NoticeCategory[]).map((cat) => {
              const list = grouped[cat];
              if (list.length === 0) return null;

              const meta = categoryMeta[cat];

              return (
                <div key={cat}>
                  {/* section title */}
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <span>{meta.label}</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {list.length}
                    </span>
                  </div>

                  {/* items */}
                  <ul className="space-y-4">
                    {list.map((n) => {
                      const { bg, Icon } = categoryStyle[n.category];

                      return (
                        <li
                          key={n.id ?? `${n.category}-${n.title}-${n.timeLabel}`}
                          className="flex items-center gap-4 rounded-2xl bg-gray-50 px-4 py-3"
                        >
                          {/* circle icon */}
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              bg
                            )}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>

                          {/* text */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {n.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {n.timeLabel}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* bottom padding (avoid overlap with bottom nav) */}
          <div className="h-4" />
        </div>
      </section>
    </>
  );
}
