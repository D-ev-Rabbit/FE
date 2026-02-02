import { Outlet } from "react-router-dom";
import MentorSidebarPc from "@/widgets/pc/MentorSidebarPc";
import MentorHeaderPc from "@/widgets/pc/MentorHeaderPc";

export default function MentorLayout() {
  return (
    <div className="h-dvh w-full overflow-hidden bg-gray-50">
      <div className="grid h-full grid-cols-[280px_1fr]">
        {/* Sidebar: 고정 */}
        <aside className="h-full overflow-hidden p-6">
          <MentorSidebarPc />
        </aside>

        {/* Right: header 고정 + content만 스크롤 */}
        <div className="h-full min-w-0">
          <div className="grid h-full grid-rows-[auto_1fr]">
            {/* Header (fixed) */}
            <header className="shrink-0 p-6 pb-0">
              <div className="flex justify-end">
                <MentorHeaderPc />
              </div>
            </header>

            {/* Content (scroll only here) */}
            <main className="min-h-0 overflow-y-auto p-6 pt-4">
              <div className="min-h-full rounded-3xl bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
