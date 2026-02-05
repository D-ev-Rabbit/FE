import { cn } from "@/shared/lib/cn";
import { HiOutlineUser } from "react-icons/hi";

type Variant = "mo" | "pc";

type Props = {
  name: string;
  grade: string; // "고등학교 2학년" 같은 텍스트
  variant: Variant;

  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function MenteeCard({
  name,
  grade,
  variant,
  selected = false,
  onClick,
  className,
}: Props) {
  const isMo = variant === "mo";

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
          : "w-48 shrink-0 rounded-2xl px-5 py-4 text-left",
        className
      )}
    >
      {isMo ? (
        <>
          {/* 아이콘 */}
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <HiOutlineUser className="h-5 w-10" />
          </div>

          {/* 학년/이름 */}
          <div className="mt-5">
            <div className="text-sm text-gray-500">{grade}</div>
            <div className="mt-2 text-base font-bold text-gray-900">{name}</div>
          </div>
        </>
      ) : (
        <>
          {/* PC: 아이콘 */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <HiOutlineUser className="h-6 w-6" />
          </div>

          {/* PC: 텍스트 */}
          <div className="absolute left-20 top-1/2 -translate-y-1/2">
            <div className="text-sm text-gray-500">{grade}</div>
            <div className="text-base font-bold text-gray-900">{name}</div>
          </div>
        </>
      )}
    </button>
  );

}
