import { cn } from "@/shared/lib/cn";
import { HiOutlineUser } from "react-icons/hi";

type Variant = "mo" | "pc";

type Props = {
  name: string;
  grade: string; // "고등학교 2학년" 같은 텍스트
  school: string;
  variant: Variant;

  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function MenteeCard({
  name,
  grade,
  school,
  variant,
  selected = false,
  onClick,
  className,
}: Props) {
  const isMo = variant === "mo";
  const formattedGrade =
    grade.includes("고등학교") || grade.includes("학년")
      ? grade
      : `고등학교 ${grade}학년`;
  const gradeTag = formattedGrade.replace("고등학교 ", "");

    return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative border bg-white transition",
        selected
          ? "border-violet-500 bg-violet-50 shadow-sm"
          : "border-gray-200 hover:border-gray-300",
        isMo
          ? "w-30 shrink-0 rounded-3xl px-4 py-4 text-center"
          : "w-52 shrink-0 rounded-2xl px-4 py-4 text-left",
        className
      )}
    >
      {isMo ? (
        <>
          {/* 아이콘 */}
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <HiOutlineUser className="h-7 w-7" />
          </div>

          {/* 학년/이름 */}
          <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                {school}
              </span>
              <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                {gradeTag}
              </span>
            </div>
            <div className="text-base font-bold text-gray-900">{name}</div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          {/* PC: 아이콘 */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <HiOutlineUser className="h-5 w-5" />
          </div>

          {/* PC: 텍스트 */}
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                {school}
              </span>
              <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                {gradeTag}
              </span>
            </div>
            <div className="text-sm font-bold text-gray-900 truncate">{name}</div>
          </div>
        </div>
      )}
    </button>
  );

}
