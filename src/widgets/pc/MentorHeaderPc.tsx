import { cn } from "@/shared/lib/cn";
import { HiOutlineBell } from "react-icons/hi";
import { LuListTodo } from "react-icons/lu";

type Props = {
  className?: string;
  onClickNotification?: () => void;
  onClickMenu?: () => void;
  onClickProfile?: () => void;
  hasNotificationDot?: boolean;
};

export default function MentorHeaderPc({
  className,
  onClickNotification,
  onClickMenu,
  onClickProfile,
  hasNotificationDot = true,
}: Props) {
  return (
    <header className={cn("flex items-center justify-end gap-4", className)}>
      {/* 알림 */}
      <button
        type="button"
        onClick={onClickNotification}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100/70"
        aria-label="알림"
      >
        <HiOutlineBell className="h-6 w-6 text-gray-900 hover:text-gray-900" />
        {hasNotificationDot && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* 메뉴 */}
      <button
        type="button"
        onClick={onClickMenu}
        className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100/70"
        aria-label="메뉴"
      >
        <LuListTodo className="h-6 w-6 text-gray-700 hover:text-gray-900" />
      </button>

      {/* 프로필 */}
      <button
        type="button"
        onClick={onClickProfile}
        className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-gray-200 hover:ring-gray-300 transition"
        aria-label="프로필"
      >
        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-100" />
      </button>
    </header>
  );
}
