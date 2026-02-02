import { useState } from "react";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import MenteeCard from "@/shared/ui/card/MenteeCard";

const mentees = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  grade: i === 5 ? "고등학교 1학년" : "고등학교 2학년",
  name: "홍길동",
}));

export default function MentorDashboardPage() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("0");

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

      <h1 className="text-lg font-semibold">멘티 선택</h1>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4">
          {mentees.map((m) => (
            <MenteeCard
              key={m.id}
              variant="pc"
              grade={m.grade}
              name={m.name}
              selected={m.id === selectedId}
              onClick={() => setSelectedId(m.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
