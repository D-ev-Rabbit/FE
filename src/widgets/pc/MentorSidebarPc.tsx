import { type ReactNode } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/cn";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineFeedback, MdChecklist } from "react-icons/md";
import { RiTodoLine } from "react-icons/ri";
import { FiLogOut, FiHome } from "react-icons/fi";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";

type Item = {
  label: string;
  to: string;
  icon: (cls: string) => ReactNode;
};

const items: Item[] = [
  { label: "Home", to: "/mentor/home", icon: (c) => <FiHome className={c} /> },
  { label: "과제", to: "/mentor/tasks", icon: (c) => <RiTodoLine className={c} /> },
  { label: "피드백", to: "/mentor/feedback", icon: (c) => <MdOutlineFeedback className={c} /> },
  { label: "할 일 관리", to: "/mentor/todo", icon: (c) => <MdChecklist className={c} /> },
  { label: "멘티 목록", to: "/mentor/mentees", icon: (c) => <HiOutlineUsers className={c} /> },
];

export default function MentorSidebarPc() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      <aside className="flex h-full w-54 flex-col rounded-3xl bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
            ✦
          </div>
          <div className="text-base font-bold tracking-wide text-violet-600">
            설스터디
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to}>
              {({ isActive }) => (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-1 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-violet-50 text-violet-600"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-gray-500", isActive
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-700 hover:bg-gray-50")}>
                    {it.icon("h-5 w-5")}
                  </span>
                  {it.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 로그아웃 버튼 */}
        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50/60"
          >
            <FiLogOut className="h-5 w-5 text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        open={open}
        variant="error"
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        cancelText="취소"
        confirmText="로그아웃"
        onCancel={() => setOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
