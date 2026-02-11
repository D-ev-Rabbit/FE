import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MentorSidebarPc from "@/widgets/pc/MentorSidebarPc";
import { cn } from "@/shared/lib/cn";
import { FiMenu, FiX } from "react-icons/fi";

export default function MentorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-dvh h-dvh w-full bg-gray-50">
      {/* dim */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-gray-50 p-2",
          "flex flex-col overflow-y-auto",
          "transition-transform duration-200 ease-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="멘토 사이드바"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-extrabold text-gray-900" />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="사이드바 닫기"
          >
            <FiX />
          </button>
        </div>
        <MentorSidebarPc />
      </aside>

      {/* layout */}
      <div className="grid h-full lg:grid-cols-[280px_1fr]">
        {/* Sidebar: PC에서만 보임 */}
        <aside className="hidden h-full overflow-hidden p-6 lg:block">
          <MentorSidebarPc />
        </aside>

        {/* Right */}
        <div className="min-w-0 h-full">
          <div className="grid h-full grid-rows-[auto_1fr]">
            {/* Header */}
            <header className="shrink-0 p-6 pb-0">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-full p-2 mb-4 hover:bg-gray-100 lg:hidden"
                  aria-label="사이드바 열기"
                >
                  <FiMenu />
                </button>
              </div>
            </header>

            <main className="min-h-0 overflow-y-auto ">
              <div className="w-full rounded-3xl bg-white p-6 sm:p-8 mr-0 lg:mr-3">
                <Outlet />
              </div>

              <div className="h-6 lg:hidden" />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
