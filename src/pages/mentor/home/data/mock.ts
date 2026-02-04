export const mentees = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  grade: i === 5 ? "고등학교 1학년" : "고등학교 2학년",
  name: "홍길동",
}));

export const statusByMenteeId: Record<
  string,
  { todo: [number, number]; submit: [number, number]; feedbackDone: [number, number] }
> = {
  "0": { todo: [5, 10], submit: [4, 15], feedbackDone: [2, 20] },
  "1": { todo: [7, 10], submit: [10, 15], feedbackDone: [12, 20] },
  "2": { todo: [1, 10], submit: [2, 15], feedbackDone: [0, 20] },
};


export const feedbackTasks = [
  {
    id: "t1",
    menteeId: "0",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3A4c3d9cd2-b959-4c39-8253-901750c37ec6%3A1000021034.jpg?table=block&id=2f0a56db-4060-800e-b82a-ca51587f22a6&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "국어" },
    title: "국어 24번",
    progress: 35,
    mentee: { name: "홍길동" },
  },
  {
    id: "t3",
    menteeId: "0",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3A13764375-3d05-441f-b287-5a11efed3d7d%3A1000020507.jpg?table=block&id=2e8a56db-4060-8067-b19f-ce45a5c84284&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "영어" },
    title: "영어 3번",
    progress: 80,
    mentee: { name: "홍길동" },
  },
  {
    id: "t1",
    menteeId: "1",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3A4c3d9cd2-b959-4c39-8253-901750c37ec6%3A1000021034.jpg?table=block&id=2f0a56db-4060-800e-b82a-ca51587f22a6&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "국어" },
    title: "국어 24번",
    progress: 35,
    mentee: { name: "홍길동" },
  },
  {
    id: "t3",
    menteeId: "1",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3A13764375-3d05-441f-b287-5a11efed3d7d%3A1000020507.jpg?table=block&id=2e8a56db-4060-8067-b19f-ce45a5c84284&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "영어" },
    title: "영어 3번",
    progress: 80,
    mentee: { name: "홍길동" },
  },
  {
    id: "t2",
    menteeId: "1",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3Ae17214e3-5e0d-4fb3-9fba-ba1f75d18cd5%3A1000020735.jpg?table=block&id=2eba56db-4060-8097-b172-ddc0f96e6ebc&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "수학" },
    title: "수학 30번",
    progress: 10,
    mentee: { name: "홍길동" },
  },
  {
    id: "t3",
    menteeId: "2",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3A13764375-3d05-441f-b287-5a11efed3d7d%3A1000020507.jpg?table=block&id=2e8a56db-4060-8067-b19f-ce45a5c84284&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "영어" },
    title: "영어 3번",
    progress: 80,
    mentee: { name: "홍길동" },
  },
  {
    id: "t3",
    menteeId: "3",
    thumbnailUrl:
      "https://malachite-fontina-5e0.notion.site/image/attachment%3A13764375-3d05-441f-b287-5a11efed3d7d%3A1000020507.jpg?table=block&id=2e8a56db-4060-8067-b19f-ce45a5c84284&spaceId=78e26a95-9822-445a-a11c-4701d3e2f7cf&width=680&userId=&cache=v2?auto=format&fit=crop&w=1200&q=80",
    subjectTag: { label: "영어" },
    title: "영어 3번",
    progress: 80,
    mentee: { name: "홍길동" },
  },
];


