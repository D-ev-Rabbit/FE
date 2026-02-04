import MentorHomeLayout from "./components/MentorHomeLayout";
import { useMentorHome } from "./hooks/useMentorHome";

export default function HomePage() {
  const {
    mentees,
    selectedId,
    setSelectedId,
    selectedStudent,
    selectedStatus,
    filteredFeedbackTasks,
  } = useMentorHome();

  return (
    <MentorHomeLayout
      mentees={mentees}
      selectedId={selectedId}
      onSelectMentee={setSelectedId}
      selectedStudent={selectedStudent}
      selectedStatus={selectedStatus}
      filteredFeedbackTasks={filteredFeedbackTasks}
    />
    
  );
}
