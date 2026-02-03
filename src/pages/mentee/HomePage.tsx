import MenteeCard from "@/shared/ui/card/MenteeCard";

const mentees = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  grade: "고등학교 2학년",
  name: "홍길동",
}));

export default function MenteeHomePage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">HOME</h1>

      <div className="overflow-x-auto">
        <div className="flex gap-6 px-3 py-4">
          {mentees.map((m) => (
            <MenteeCard key={m.id} variant="mo" grade={m.grade} name={m.name} />
          ))}
        </div>
      </div>

    </div>
  );
}
