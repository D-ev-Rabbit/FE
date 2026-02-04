import clsx from "clsx";

export type MenteeRowData = {
  id: string;
  name: string;
  date: string;
  school: string;
  grade: string;
};

type Props = {
  data: MenteeRowData;
  selected?: boolean;
  onClick?: () => void;
};

export default function MenteeRow({ data, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "w-full rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition",
        "hover:bg-gray-50",
        selected ? "border-violet-300 ring-2 ring-violet-200" : "border-gray-100"
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* 이름 + 날짜 */}
        <div className="min-w-[160px] shrink-0">
          <div className="text-sm font-semibold text-gray-900">{data.name}</div>
          <div className="text-xs text-gray-400">{data.date}</div>
        </div>

        {/* 학교 */}
        <div className="flex-1 text-sm text-gray-700">{data.school}</div>

        {/* 학년 */}
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-600">
          {data.grade}
        </span>
      </div>
    </button>
  );
}
