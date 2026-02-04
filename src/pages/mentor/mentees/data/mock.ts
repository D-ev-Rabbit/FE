import type { MenteeRowData } from "@/pages/mentor/mentees/components/MenteeRow";

export const MenteeRows: MenteeRowData[] = [
  {
    id: "1",
    name: "홍길동",
    date: "25/2/2023",
    school: "서울고등학교",
    grade: "고등학교 1학년",
  },
  {
    id: "2",
    name: "정길동",
    date: "25/2/2023",
    school: "서울고등학교",
    grade: "고등학교 1학년",
  },
];

export const StatusByMenteeId: Record<
  string,
  { todo: [number, number]; submit: [number, number]; feedbackDone: [number, number] }
> = {
  "1": { todo: [5, 10], submit: [4, 15], feedbackDone: [2, 20] },
  "2": { todo: [7, 10], submit: [10, 15], feedbackDone: [12, 20] },
};
