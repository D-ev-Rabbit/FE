import { cn } from "@/shared/lib/cn";
import { HiOutlineBell } from "react-icons/hi";
import { FiUser } from "react-icons/fi";

type Props = {
  showLogo?: boolean;
  hasNotificationDot?: boolean;
  onClickNotification?: () => void;
  onClickProfile?: () => void;
  className?: string;
};

export default function MobileHeader({
  showLogo = true,
  hasNotificationDot = true,
  onClickNotification,
  onClickProfile,
  className,
}: Props) {
  return (
    <header className={cn("bg-gray-50 pb-4", className)}>
      <div className="mx-2 mt-6 rounded-3xl bg-white px-5 py-3 shadow-md">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            {showLogo && (
              <>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white text-sm">
                  ✦
                </div>
                <div className="text-base font-extrabold tracking-wide text-violet-600">
                  설스터디
                </div>
              </>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* 알림 */}
            <button
              type="button"
              onClick={onClickNotification}
              className="relative flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="알림"
            >
              <HiOutlineBell size={16} className="text-gray-800" />
              {hasNotificationDot && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* 프로필 */}
            <button
              type="button"
              onClick={onClickProfile}
              className="flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="프로필"
            >
              <FiUser size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
