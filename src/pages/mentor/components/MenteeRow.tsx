import clsx from "clsx";
import { HiOutlineUser } from "react-icons/hi";

export type MenteeRowData = {
  id: string;
  name: string;
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
        "hover:shadow-md hover:border-violet-200",
        selected ? "border-violet-300 ring-2 ring-violet-200" : "border-gray-100"
      )}
    >
      {/* Mobile */}
      <div className="flex min-w-0 items-center gap-3 sm:hidden">
        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            selected ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"
          )}
          aria-hidden
        >
          <HiOutlineUser className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900">{data.name}</div>
          <div className="mt-2 flex flex-col gap-1">
            <span className="inline-flex w-fit max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
              {data.school}
            </span>
            <span className="inline-flex w-fit rounded-full bg-violet-100 px-3 py-1 text-[11px] font-semibold text-violet-700">
              {data.grade}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden min-w-0 items-center gap-4 sm:flex">
        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            selected ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"
          )}
          aria-hidden
        >
          <HiOutlineUser className="h-5 w-5" />
        </div>

        {/* 이름 */}
        <div className="min-w-[120px] shrink-0">
          <div className="text-sm font-semibold text-gray-900">{data.name}</div>
          <div className="mt-0.5 text-xs text-gray-400">멘티</div>
        </div>

        {/* 학교 */}
        <div className="flex-1 pr-4">
          <span className="inline-flex max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            {data.school}
          </span>
        </div>

        {/* 학년 */}
        <span className="min-w-[120px] text-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          {data.grade}
        </span>
      </div>
    </button>
  );
}
