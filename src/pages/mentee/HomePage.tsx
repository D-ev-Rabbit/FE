import { useNotify } from "@/shared/ui/notification/NotificationProvider";

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
    </div>
  );
}
