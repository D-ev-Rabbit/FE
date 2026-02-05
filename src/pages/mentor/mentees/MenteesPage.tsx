import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalBase from "@/shared/ui/modal/ModalBase";
import { FaRegCalendar, FaPen, FaTasks } from "react-icons/fa";
import { MenteeRows, StatusByMenteeId } from "./data/mock";
import StudentStatusCard from "@/pages/mentor/components/StudentStatusCard";
import StudentStatusDetailModal from "@/pages/mentor/components/StudentStatusDetailModal";
import ActionCard from "../components/ActionCard";

import MenteeList from "../components/MenteeList";
import type { MenteeRowData } from "../components/MenteeRow";
import CalendarPopover from "../components/CalendarPopover";

export default function MenteesPage() {
  const navigate = useNavigate();

  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(
    MenteeRows[0]?.id ?? null
  );
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const selectedStatus = selectedMenteeId ? StatusByMenteeId[selectedMenteeId] : null;

  // 더미데이터 가져오기
  const selectedStudent = useMemo(() => {
    if (!selectedMenteeId) return null;
    return MenteeRows.find((x) => x.id === selectedMenteeId) ?? null;
  }, [selectedMenteeId]);

  const handleSelect = (row: MenteeRowData) => {
    setSelectedMenteeId(row.id);
  };

  // 캘린더
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  return (
    <div className="w-full">
      <div className="mb-5">
        <div className="text-sm font-extrabold text-gray-900">멘티 목록</div>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px]">
        {/* 멘티 리스트 */}
        <section className="w-full ">
          <MenteeList
            rows={MenteeRows}
            selectedId={selectedMenteeId}
            onSelect={handleSelect}
          />
        </section>

        {/* 오른쪽 aside */}
        <aside className="w-full space-y-4 p-4">
          {/* 날짜 + 버튼 */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <FaRegCalendar/>
              </span>
              <span>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {/* 캘린더 날짜 선택버튼 */}
            <button
              type="button"
              onClick={() => setCalendarOpen((prev) => !prev)}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Today
            </button>
            
            {/* 캘린더 팝업 */}
            {calendarOpen && (
              
              <ModalBase open={calendarOpen} onClose={() => setCalendarOpen(false)}>
                <div className="relative">
                  <CalendarPopover
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }}
                    onClose={() => setCalendarOpen(false)}
                  />
                </div>
              </ModalBase>
              
            )}
          </div>

          {/* 현황 카드 */}
          <div className="rounded-3xl bg-white">
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

                <ModalBase open={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
                  <StudentStatusDetailModal
                    studentName={`${selectedStudent.grade} · ${selectedStudent.name}`}
                    open={statusModalOpen}
                    onClose={() => setStatusModalOpen(false)}
                    avgStudyTimeText="90H 45M"
                    minTaskAchievementRate={70}
                    feedbackResponseRate={85}
                  />
                </ModalBase>
              </>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">왼쪽에서 멘티를 선택하세요.</p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              label="할 일 배정하기"
              onClick={() => navigate(`/mentor/todo?menteeId=${selectedMenteeId ?? ""}`)}
              iconLeft={<FaTasks className="h-4 w-4" />}
            />
            <ActionCard
              label="피드백 작성하기"
              onClick={() => navigate(`/mentor/feedback?menteeId=${selectedMenteeId ?? ""}`)}
              iconLeft={<FaPen className="h-4 w-4" />}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
