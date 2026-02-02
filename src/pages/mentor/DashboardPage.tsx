import { useState } from "react";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";

export default function MentorDashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">멘토 대시보드</h1>

      <button
        className="h-12 rounded-xl bg-black px-5 text-white"
        onClick={() => setOpen(true)}
      >
        PC 모달 열기
      </button>

      <ConfirmModal
        open={open}
        variant="error"
        title="실패"
        description="다시 한번 확인해 주세요."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        cancelText="취소"
        confirmText="확인"
      />
    </div>
  );
}
