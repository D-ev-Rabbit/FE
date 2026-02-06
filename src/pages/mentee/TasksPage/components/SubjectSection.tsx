import TaskRow from "./TaskRow";
import type { SubjectSection } from "../types/tasks";

interface SubjectSectionProps {
  section: SubjectSection;
}

export default function SubjectSection({ section }: SubjectSectionProps) {
  return (
    <section className="space-y-3">
      <div className="text-base font-bold text-gray-800">
        {section.label}
      </div>
      {section.tasks.length === 0 ? (
        <div className="min-h-[70px] rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
          등록된 과제가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {section.tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
