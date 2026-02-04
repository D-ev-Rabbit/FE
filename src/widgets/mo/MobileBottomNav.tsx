import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/cn";
import { FiUser } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";
import { HiOutlineCalendar } from "react-icons/hi2";
import { AiOutlineDashboard } from "react-icons/ai";

import type { ReactNode } from "react";

type NavItem = {
  label: string;
  to: string;
  icon: (cls: string) => ReactNode;
};

type Props = {
  basePath: "/mentee" | "/mentor";
  className?: string;
};

export default function MobileBottomNav({ basePath, className }: Props) {
  const items: NavItem[] = [
    { label: "플래너", to: `${basePath}/calendar`, icon: (c) => <HiOutlineCalendar className={c} /> },
    { label: "과제", to: `${basePath}/tasks`, icon: (c) => <RiTodoLine className={c} /> },
    { label: "나의 활동", to: `${basePath}/activity`, icon: (c) => <AiOutlineDashboard className={c} /> },
    { label: "마이페이지", to: `${basePath}/mypage`, icon: (c) => <FiUser className={c} /> },
  ];

  return (
    <nav className={cn("z-30", className)} aria-label="하단 네비게이션">
      <div className="px-2 pb-3">
        <div className="rounded-3xl bg-[#EEF0F5] px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className="flex-1"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center justify-center gap-1 py-1.5">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full transition",
                        isActive ? "bg-violet-600" : "bg-transparent"
                      )}
                    >
                      {it.icon(
                        cn(
                          "h-3.5 w-3.5",
                          isActive ? "text-white" : "text-gray-500"
                        )
                      )}
                    </div>

                    <div
                      className={cn(
                        "text-xs font-semibold tracking-wide",
                        isActive ? "text-gray-800" : "text-gray-500"
                      )}
                    >
                      {it.label}
                    </div>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
