import { cn } from "@/shared/lib/cn";
import { HiOutlineBell } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "@/widgets/notifications/NotificationPopup";

type Props = {
  showLogo?: boolean;
  hasNotificationDot?: boolean;
  className?: string;
};

export default function MobileHeader({
  showLogo = true,
  className,
}: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [profileOpen]);

  /* 로그아웃 */
  const handleLogout = () => {
    // TODO: 필요하면 토큰/스토리지 정리
    // localStorage.removeItem("accessToken");

    navigate("/auth/login", { replace: true });
  };

  return (
    <header className={cn("bg-gray-50 pb-4", className)}>
      <div className="mx-2 mt-6 rounded-3xl bg-white px-5 py-3 shadow-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Right */}
          <div className="flex items-center gap-1 relative">
            {/* 알림 */}
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="btn-none relative flex items-center justify-center rounded-full"
              aria-label="알림"
            >
              <HiOutlineBell size={18} className="text-gray-800" />
            </button>

            <NotificationPopup
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              onNoticeClick={(notice) => {
                // 예시 라우팅: 카테고리별 상세로 보내기
                if (notice.category === "task_feedback") navigate("/mentee/tasks");
                if (notice.category === "planner_feedback") navigate("/mentee/calendar");
                if (notice.category === "task_missing") navigate("/mentee/tasks");
              }}
            />


            {/* 프로필 + 로그아웃 */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(v => !v)}
                className="
                  flex h-8 w-8 items-center justify-center
                  overflow-hidden rounded-full
                  p-0 border-0 bg-transparent"
                aria-label="프로필">
                <img
                  src="/user.png"
                  alt="프로필"
                  className="block h-full w-full object-cover"
                />
              </button>


              {profileOpen && (
                <div className="absolute right-0 top-11 z-50 w-44 rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 rounded-2xl"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
                      <FiLogOut size={16} />
                    </span>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
