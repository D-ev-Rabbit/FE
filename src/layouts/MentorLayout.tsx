import { Outlet } from "react-router-dom";
import MentorSidebarPc from "@/widgets/pc/MentorSidebarPc";
import MentorHeaderPc from "@/widgets/pc/MentorHeaderPc";

export default function MentorLayout() {
  return (
    <div className="min-h-dvh bg-gray-50">
      {/* 화면 전체 */}
      <div className="grid min-h-dvh grid-cols-[288px_1fr] gap-4 p-4">
        {/* Left */}
        <MentorSidebarPc />

        {/* Right */}
        <div className="min-w-0 flex flex-col">
          {/* ✅ 헤더: 덮이지 않게 sticky + z 높게 */}
          <div className="sticky top-0 z-20 flex items-center justify-end pb-3 pr-2">
            <MentorHeaderPc />
          </div>

          {/* ✅ 본문: 남은 공간을 채우고, 헤더를 절대 덮지 않음 */}
          <main className="flex-1 min-h-0 rounded-3xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
