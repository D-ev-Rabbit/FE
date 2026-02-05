import MenteeCard from "@/shared/ui/card/MenteeCard";
import StudentStatusCard from "../../components/StudentStatusCard";
import FeedbackTaskCard from "../../components/FeedbackTaskCard";
import ModalBase from "@/shared/ui/modal/ModalBase";
import StudentStatusDetailModal from "../../components/StudentStatusDetailModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  mentees: { id: string; grade: string; name: string }[];
  selectedId: string;
  onSelectMentee: (id: string) => void;

  selectedStudent: { id: string; grade: string; name: string } | null;
  selectedStatus: {
    todo: [number, number];
    submit: [number, number];
    feedbackDone: [number, number];
  } | null;

  filteredFeedbackTasks: any[];
};

export default function MentorHomeLayout({
  mentees,
  selectedId,
  onSelectMentee,
  selectedStudent,
  selectedStatus,
  filteredFeedbackTasks,
}: Props) {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const navigate = useNavigate();

  /** -----------------------------
   *  1) 멘티 선택 가로 스크롤 (버튼으로 scrollBy)
   * ----------------------------- */
  const menteeRowRef = useRef<HTMLDivElement | null>(null);

  const scrollMentees = (dir: "left" | "right") => {
    const el = menteeRowRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  /** -----------------------------
   *  2) 피드백 카드: 한 장씩 넘기기
   * ----------------------------- */
  const [taskIndex, setTaskIndex] = useState(0);

  useEffect(() => {
    setTaskIndex(0);
  }, [filteredFeedbackTasks]);

  const taskCount = filteredFeedbackTasks.length;
  const clampTask = (n: number) => Math.max(0, Math.min(taskCount - 1, n));
  const goPrevTask = () => setTaskIndex((i) => clampTask(i - 1));
  const goNextTask = () => setTaskIndex((i) => clampTask(i + 1));

  const currentTask = useMemo(
    () => (taskCount > 0 ? filteredFeedbackTasks[taskIndex] : null),
    [filteredFeedbackTasks, taskIndex, taskCount]
  );

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* =========================
          멘티 선택
         ========================= */}
      <section className="space-y-3">
        {/* 모바일: px-0 / lg: px-4 */}
        <div className="flex items-center justify-between lg:px-4">
          <div className="text-sm font-extrabold text-gray-900">멘티 선택</div>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollMentees("left")}
              className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              aria-label="이전 멘티"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => scrollMentees("right")}
              className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              aria-label="다음 멘티"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 모바일: 좌우 padding 줄이고 스크롤 자연스럽게 */}
        <div className="lg:px-4">
          <div
            ref={menteeRowRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 lg:gap-4"
            style={{ scrollbarWidth: "none" as any }}
          >
            {mentees.map((m) => (
              <MenteeCard
                key={m.id}
                variant="pc"
                grade={m.grade}
                name={m.name}
                selected={m.id === selectedId}
                onClick={() => onSelectMentee(m.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          아래: 모바일 1열 / lg 2열
         ========================= */}
      <section className="grid gap-8 lg:gap-10 lg:px-4 lg:grid-cols-2">
        {/* ---- 좌: 현황 ---- */}
        <div className="space-y-3 lg:space-y-4">
          {/* 타이틀 높이를 고정해서 우측과 시작선 맞춤 */}
          <div className="flex min-h-[40px] items-center">
            <div className="text-sm font-extrabold text-gray-900">현황</div>
          </div>

          {/* 모바일에서 카드가 꽉 차도록 */}
          <div className="w-full">
            {selectedStudent && selectedStatus ? (
              <>
                <StudentStatusCard
                  studentName={`${selectedStudent.grade} · ${selectedStudent.name}`}
                  periodLabel="Today"
                  items={[
                    {
                      label: "To do",
                      current: selectedStatus.todo[0],
                      total: selectedStatus.todo[1],
                      barClassName: "bg-green-500",
                      trackClassName: "bg-green-100",
                    },
                    {
                      label: "제출파일",
                      current: selectedStatus.submit[0],
                      total: selectedStatus.submit[1],
                      barClassName: "bg-purple-500",
                      trackClassName: "bg-purple-100",
                    },
                    {
                      label: "피드백 작성 완료",
                      current: selectedStatus.feedbackDone[0],
                      total: selectedStatus.feedbackDone[1],
                      barClassName: "bg-blue-500",
                      trackClassName: "bg-blue-100",
                    },
                  ]}
                  onClick={() => setStatusModalOpen(true)}
                />

                <ModalBase
                  open={statusModalOpen}
                  onClose={() => setStatusModalOpen(false)}
                >
                  <StudentStatusDetailModal
                    studentName={
                      selectedStudent
                        ? `${selectedStudent.grade} · ${selectedStudent.name}`
                        : ""
                    }
                    open={statusModalOpen}
                    onClose={() => setStatusModalOpen(false)}
                    avgStudyTimeText="90H 45M"
                    minTaskAchievementRate={70}
                    feedbackResponseRate={85}
                  />
                </ModalBase>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                위에서 학생을 선택하면 현황이 표시됩니다.
              </p>
            )}
          </div>
        </div>

        {/* ---- 우: 피드백 할 과제 ---- */}
        <div className="space-y-3 lg:space-y-4">
          {/* 타이틀 영역을 좌측과 동일 높이로 */}
          <div className="flex min-h-[40px] items-center justify-between">
            <div className="text-sm font-extrabold text-gray-900">피드백 할 과제</div>

            {/* 버튼은 모바일에서도 보여주되, 크기/간격 반응형 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevTask}
                disabled={taskIndex === 0}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                aria-label="이전 과제"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={goNextTask}
                disabled={taskIndex >= taskCount - 1}
                className="btn-none grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                aria-label="다음 과제"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>

          {currentTask ? (
            <div className="w-full lg:max-w-[520px]">
              <FeedbackTaskCard
                key={`${currentTask.id}-${currentTask.menteeId}`}
                menteeId={currentTask.menteeId}
                thumbnailUrl={currentTask.thumbnailUrl}
                subjectTag={currentTask.subjectTag}
                title={currentTask.title}
                mentee={currentTask.mentee}
                onClick={() => {
                  navigate(
                    `/mentor/feedback?menteeId=${currentTask.menteeId}&todoId=${currentTask.id}`
                  );
                }}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
              피드백할 과제가 없습니다.
            </div>
          )}

          {taskCount > 0 && (
            <div className="text-right text-xs text-gray-400">
              {taskIndex + 1}/{taskCount}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
