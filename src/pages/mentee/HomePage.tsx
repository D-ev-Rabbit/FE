import { useNotify } from "@/shared/ui/notification/NotificationProvider";
import MenteeCard from "@/shared/ui/card/MenteeCard";

const mentees = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  grade: "고등학교 2학년",
  name: "홍길동",
}));

export default function MenteeHomePage() {
  const notify = useNotify();

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">멘티 홈</h1>

      <button
        className="h-12 rounded-xl border bg-white px-5"
        onClick={() => notify.error("실패", "모바일 버전 실패 모달")}
      >
        실패 알림
      </button>

      <button
        className="h-12 rounded-xl border bg-white px-5"
        onClick={() => notify.success("성공", "모바일 버전 성공 모달")}
      >
        성공 알림
      </button>

      <button
        className="h-12 rounded-xl border bg-white px-5"
        onClick={() => notify.info("안내", "모바일 버전 안내 모달")}
      >
        안내 알림
      </button>


      <div className="overflow-x-auto">
        <div className="flex gap-6 px-6 py-4">
          {mentees.map((m) => (
            <MenteeCard key={m.id} variant="mo" grade={m.grade} name={m.name} />
          ))}
        </div>
      </div>

    </div>
  );
}
