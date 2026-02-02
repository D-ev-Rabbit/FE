import { Outlet } from "react-router-dom";
import AppShell from "@/app/AppShell";
import MobileHeader from "@/widgets/mo/MobileHeader";
import MobileBottomNav from "@/widgets/mo/MobileBottomNav";
import FloatingConsultButton from "@/widgets/floating/FloatingConsultButton";

export default function MenteeLayout() {
  return (
    <AppShell>
      {/* 헤더/메인/네비 3단 고정 레이아웃 */}
      <div className="relative grid h-dvh grid-rows-[auto_1fr_auto]">
        {/* Top (fixed) */}
        <div className="shrink-0 bg-gray-50">
          <MobileHeader />
        </div>

        {/* Middle (scroll only here) */}
        <main className="overflow-y-auto px-4 pb-6">
          <Outlet />
        </main>
        
        {/* Bottom (fixed) */}
        <div className="shrink-0 bg-gray-50">
          <FloatingConsultButton
          to="https://forms.gle/FchKdDcm23JdGHpK9"
          internal={false}
          newTab
        />
          <MobileBottomNav basePath="/mentee" />
        </div>
      </div>
    </AppShell>
  );
}
