import { cn } from "@/shared/lib/cn";
import { HiOutlineBell } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "@/widgets/notifications/NotificationPopup";
import { menteeNotificationApi } from "@/api/mentee/notification";
import type { NotificationResponse } from "@/types/notification";
import type { Notice } from "@/widgets/notifications/types";

function formatRelativeTime(isoString: string) {
  const createdAt = new Date(isoString);
  const diffMs = Date.now() - createdAt.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  const yyyy = createdAt.getFullYear();
  const mm = String(createdAt.getMonth() + 1).padStart(2, "0");
  const dd = String(createdAt.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function toNotice(item: NotificationResponse): Notice {
  const title = item.subject ? `${item.subject} ${item.message}` : item.message;

  return {
    id: String(item.id),
    type: item.type,
    title,
    timeLabel: formatRelativeTime(item.createdAt),
    todoId: item.todoId ?? undefined,
    plannerId: item.plannerId ?? undefined,
    plannerDate: item.plannerDate ?? undefined,
  };
}

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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeCount, setNoticeCount] = useState(0);

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

  useEffect(() => {
    if (!notifOpen) return;

    let ignore = false;
    menteeNotificationApi.getNotifications()
      .then((res) => {
        if (ignore) return;
        const items = res.data.items ?? [];
        setNotices(items.map(toNotice));
        setNoticeCount(items.length);
      })
      .catch(() => {
        if (ignore) return;
        setNotices([]);
        setNoticeCount(0);
      });

    return () => {
      ignore = true;
    };
  }, [notifOpen]);

  useEffect(() => {
    let ignore = false;
    menteeNotificationApi.getNotifications()
      .then((res) => {
        if (ignore) return;
        const items = res.data.items ?? [];
        setNoticeCount(items.length);
      })
      .catch(() => {
        if (ignore) return;
        setNoticeCount(0);
      });
    return () => {
      ignore = true;
    };
  }, []);

  /* 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    navigate("/auth/login", { replace: true });
  };

  return (
    <header className={cn("bg-gray-50 pb-4", className)}>
      <div className="mx-2 mt-6 rounded-3xl bg-white px-5 py-3 shadow-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {showLogo && (
              <button
                type="button"
                onClick={() => navigate("/mentee/calendar")}
                className="flex items-center gap-3 border-0 bg-transparent p-0 outline-none focus:outline-none focus-visible:outline-none"
                aria-label="멘티 일일 플래너로 이동"
              >
                {/* 로고 */}
                <div className="mx-auto flex">
                  <img
                    src="/logo.png"
                    alt="설스터디 로고"
                    className="h-10 w-auto"
                  />
                </div>
              </button>
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
              <span className="relative inline-flex">
                <HiOutlineBell size={20} className="text-gray-800" />
                {noticeCount > 0 && (
                  <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </span>
            </button>

            <NotificationPopup
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              notices={notices}
              onNoticeClick={(notice) => {
                if (notice.id) {
                  menteeNotificationApi.markRead(Number(notice.id))
                    .then(() => {
                      setNotices((prev) => prev.filter((n) => n.id !== notice.id));
                      setNoticeCount((prev) => Math.max(0, prev - 1));
                    })
                    .catch(() => {
                      // ignore failures to keep UI responsive
                    });
                }

                // 특정 과제/플래너가 있으면 상세로, 없으면 목록으로
                if (notice.type === "TODO_COMMENT" || notice.type === "FILE_FEEDBACK") {
                  if (notice.todoId != null) {
                    navigate(`/mentee/tasks/${notice.todoId}`);
                  } else {
                    navigate("/mentee/tasks");
                  }
                } else if (notice.type === "PLANNER_COMMENT") {
                  if (notice.plannerDate != null) {
                    navigate(`/mentee/calendar?date=${notice.plannerDate}`);
                  } else {
                    navigate("/mentee/calendar");
                  }
                } else if (notice.type === "TODO_INCOMPLETE") {
                  if (notice.todoId != null) {
                    navigate(`/mentee/tasks/${notice.todoId}`);
                  } else {
                    navigate("/mentee/tasks");
                  }
                }
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
