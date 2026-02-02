import { IconCheck, IconError, IconInfo } from "@/shared/ui/modal/icons";

export type NoticeVariant = "success" | "error" | "info";

export type Notice = {
  id: string;
  variant: NoticeVariant;
  title: string;
  message?: string;
  ttlMs?: number;
};

const style = {
  error: {
    iconWrap: "bg-red-100 text-red-600",
    icon: (cls: string) => <IconError className={cls} />,
  },
  success: {
    iconWrap: "bg-green-100 text-green-600",
    icon: (cls: string) => <IconCheck className={cls} />,
  },
  info: {
    iconWrap: "bg-yellow-100 text-yellow-600",
    icon: (cls: string) => <IconInfo className={cls} />,
  },
};

export default function NotificationHost({
  items,
  onClose,
}: {
  items: Notice[];
  onClose: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-16 z-50 px-4">
      <div className="mx-auto grid max-w-md gap-3">
        {items.map((n) => {
          const s = style[n.variant];
          return (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-lg"
            >
              <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${s.iconWrap}`}>
                {s.icon("h-5 w-5")}
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{n.title}</div>
                {n.message && (
                  <div className="mt-1 text-xs text-gray-500">{n.message}</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onClose(n.id)}
                aria-label="닫기"
                className="
                  flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"> ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
