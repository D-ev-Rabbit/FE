import MenteeCard from "@/shared/ui/card/MenteeCard";
import StudentStatusCard from "./StudentStatusCard";
import FeedbackTaskCard from "./FeedbackTaskCard";
import ModalBase from "@/shared/ui/modal/ModalBase";
import StudentStatusDetailModal from "../components/StudentStatusDetailModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  filteredFeedbackTasks: any[]; // 타입 있으면 교체
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">HOME</h1>

      {/* 멘티 목록 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">멘티 목록</h2>
        <div className="overflow-x-auto p-4">
          <div className="flex gap-4">
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

      {/* 현황 */}
      <section className="p-4 pt-8">
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
                    selectedStudent ? `${selectedStudent.grade} · ${selectedStudent.name}` : ""
                }
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                // 일단 더미 값 (나중에 API 값 연결)
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
      </section>

      {/* 피드백 과제 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold px-4">피드백할 과제</h2>
        <div className="relative px-4">
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-2">
              {filteredFeedbackTasks.map((task) => (
                <FeedbackTaskCard
                  key={`${task.id}-${task.menteeId}`} // 더미 중복 id 방지
                  menteeId={task.menteeId}
                  thumbnailUrl={task.thumbnailUrl}
                  subjectTag={task.subjectTag}
                  title={task.title}
                  progress={task.progress}
                  mentee={task.mentee}
                  onClick={() => {
                        navigate(`/mentor/feedback?menteeId=${task.menteeId}&todoId=${task.id}`);
                  }}

                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
