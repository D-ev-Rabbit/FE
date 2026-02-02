import { useState } from "react";
import MenteeCard from "@/shared/ui/card/MenteeCard";

const mentees = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  grade: i === 5 ? "고등학교 1학년" : "고등학교 2학년",
  name: "홍길동",
}));

export default function MentorHomePage() {
  const [selectedId, setSelectedId] = useState<string>("0");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">HOME</h1>

      <h1 className="text-lg font-semibold">멘티 목록</h1>

      <div className="overflow-x-auto p-4">
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
