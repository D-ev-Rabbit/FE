import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/cn";
import { FiHome } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";
import { HiOutlineCalendar } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
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
    { label: "HOME", to: `${basePath}/home`, icon: (c) => <FiHome className={c} /> },
    { label: "과제", to: `${basePath}/tasks`, icon: (c) => <RiTodoLine className={c} /> },
    { label: "캘린더", to: `${basePath}/calendar`, icon: (c) => <HiOutlineCalendar className={c} /> },
    { label: "Settings", to: `${basePath}/settings`, icon: (c) => <CiSettings className={c} /> },
  ];

  return (
    <nav className={cn("z-30", className)} aria-label="하단 네비게이션">
      <div className="px-2 pb-2">
        <div className="rounded-3xl bg-[#EEF0F5] px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className="flex-1"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full transition",
                        isActive ? "bg-violet-600" : "bg-transparent"
                      )}
                    >
                      {it.icon(
                        cn(
                          "h-4 w-4",
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
