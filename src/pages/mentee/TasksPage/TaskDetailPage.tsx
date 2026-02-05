import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiDownload, FiUpload, FiChevronLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { createTaskData, findTaskById } from "./data/mock";
import { formatKoreanDate, parseDateKey } from "./utils/date";
import { cn } from "@/shared/lib/cn";
import ModalBase from "@/shared/ui/modal/ModalBase";

const statusConfig = {
  done: {
    label: "제출 완료",
    className: "bg-emerald-100 text-emerald-600",
  },
  pending: {
    label: "미완료",
    className: "bg-gray-200 text-gray-500",
  },
} as const;

export default function MenteeTaskDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const baseDate = useMemo(() => new Date(), []);
  const { tasksByDate } = useMemo(() => createTaskData(baseDate), [baseDate]);

  const taskId = Number(params.taskId);
  const task = Number.isNaN(taskId) ? null : findTaskById(tasksByDate, taskId);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activePinId, setActivePinId] = useState<number | null>(null);
  const [showPins, setShowPins] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [uploads, setUploads] = useState<Array<{ id: number; url: string }>>([]);

  if (!task) {
    return (
      <div className="space-y-4 pb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600"
        >
          <FiChevronLeft />
          과제로 돌아가기
        </button>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          과제를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const status = statusConfig[task.status];
  const handleUpload = (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploads((prev) => [...prev, { id: Date.now(), url }]);
    setUploadOpen(false);
  };
  const feedbackPins = [
    { id: 1, left: "70%", top: "20%", text: "문단 첫 문장에 주어-서술어 호응 체크" },
    { id: 2, left: "30%", top: "55%", text: "예시를 하나 더 추가하면 설득력이 좋아져요" },
  ];

  return (
    <>
      <div className="space-y-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600"
      >
        <FiChevronLeft />
        과제로 돌아가기
      </button>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {formatKoreanDate(parseDateKey(task.dateKey))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500"
            >
              <FiDownload size={12} />
              과제 다운로드(PDF)
            </button>
            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", status.className)}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
            {task.subjectLabel}
          </span>
          <div className="text-lg font-bold text-gray-900">{task.title}</div>
        </div>

      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-700">학습 점검하기</div>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-500"
          >
            사진 업로드
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-gray-500">
          <div className="grid w-full grid-cols-3 gap-3 pt-2">
            {uploads.map((upload, index) => {
              const hasImage = !!upload;
              return (
                <button
                  key={`upload-${upload.id}`}
                  type="button"
                  onClick={() => {
                    if (!hasImage) return;
                    setActivePinId(null);
                    setActiveImageIndex(index);
                    setDetailOpen(true);
                  }}
                  className={cn(
                    "btn-none aspect-[3/4] w-full overflow-hidden bg-transparent p-0 outline-none focus:outline-none focus-visible:outline-none",
                    hasImage ? "cursor-pointer" : "cursor-default"
                  )}
                  aria-label={hasImage ? "업로드된 사진 보기" : "빈 슬롯"}
                >
                  {hasImage ? (
                    <div className="relative h-full w-full">
                      <img
                        src={upload.url}
                        alt="업로드 이미지"
                        className="h-full w-full object-contain bg-white"
                      />
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-500 shadow-sm">
        <div className="mb-3 text-left text-sm font-semibold text-gray-700">멘토 피드백</div>
        이곳에 멘토 피드백이 기록됩니다.
      </section>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-violet-400 bg-white px-6 py-2.5 text-sm font-extrabold text-violet-600"
        >
          취소
        </button>
        <button
          type="button"
          className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-extrabold text-white"
        >
          저장
        </button>
      </div>
      </div>
      <ModalBase open={uploadOpen} onClose={() => setUploadOpen(false)}>
      <div className="w-full rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)] sm:w-[360px]">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">사진 업로드</div>
          <button
            type="button"
            onClick={() => setUploadOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <FiX />
          </button>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500">
          JPG 또는 PNG 파일을 선택하세요.
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleUpload(event.target.files?.[0])}
          className="mt-3 w-full text-xs text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-600"
        />
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setUploadOpen(false)}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-600"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => setUploadOpen(false)}
            className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white"
          >
            업로드
          </button>
        </div>
      </div>
    </ModalBase>
      <ModalBase open={detailOpen} onClose={() => setDetailOpen(false)}>
        <div className="w-full rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.16)] sm:w-[360px]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDetailOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
            >
              <FiChevronLeft />
              과제로 돌아가기
            </button>
            <button
              type="button"
              onClick={() => setShowPins((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm"
              aria-label={showPins ? "코멘트 숨기기" : "코멘트 보이기"}
              title={showPins ? "코멘트 숨기기" : "코멘트 보이기"}
            >
              {showPins ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
          </div>
          <div className="mt-3 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
              {uploads[activeImageIndex] ? (
                <img
                  src={uploads[activeImageIndex].url}
                  alt="상세 피드백 이미지"
                  className="absolute inset-0 h-full w-full object-contain bg-white"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg, rgba(59,130,246,0.12) 0 6px, rgba(59,130,246,0.02) 6px 12px)",
                  }}
                />
              )}
              {showPins &&
                feedbackPins.map((pin) => {
                const isSelected = activePinId === pin.id;
                const fillClass = isSelected ? "fill-violet-600" : "fill-black/70";
                const textClass = isSelected ? "text-violet-700" : "text-violet-700";

                return (
                  <button
                    key={`detail-pin-${pin.id}`}
                    type="button"
                    onClick={() => setActivePinId((prev) => (prev === pin.id ? null : pin.id))}
                    style={{ left: pin.left, top: pin.top }}
                    aria-label={`피드백 코멘트 ${pin.id}`}
                    className={cn(
                      "btn-none",
                      "appearance-none",
                      "bg-transparent hover:bg-transparent active:bg-transparent",
                      "outline-none ring-0 focus:outline-none focus:ring-0",
                      "absolute -translate-x-1/2 -translate-y-[90%]",
                      "transition-transform duration-200 hover:scale-110",
                      isSelected ? "z-30 scale-110" : "z-20"
                    )}
                  >
                    <span className="relative block h-11 w-10">
                      <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
                        <path
                          d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.35 11.58 7.59 12.78a.6.6 0 0 0 .82 0C13.65 21.58 20 15.25 20 10c0-4.42-3.58-8-8-8z"
                          className={cn("transition-colors duration-150", fillClass)}
                        />
                      </svg>
                      <span
                        className={cn(
                          "pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2",
                          "flex h-6 min-w-6 items-center justify-center rounded-full px-1",
                          "bg-white text-[12px] font-extrabold leading-none shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
                          textClass
                        )}
                      >
                        {pin.id}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-xs text-gray-700">
            <div className="mb-2 text-xs font-extrabold text-gray-800">멘토 피드백</div>
            {activePinId
              ? feedbackPins.find((pin) => pin.id === activePinId)?.text
              : "사진의 번호를 눌러 코멘트를 확인하세요."}
          </div>
        </div>
      </ModalBase>
    </>
  );
}
