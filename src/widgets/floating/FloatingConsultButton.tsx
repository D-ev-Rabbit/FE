import { cn } from "@/shared/lib/cn";
import { useState } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";

type Props = {
  to: string;
  internal?: boolean;
  newTab?: boolean;
  className?: string;
};

export default function FloatingConsultButton({
  to,
  internal = false,
  newTab = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false);


  const goLink = () => {
    if (internal) {
      window.location.href = to;
    } else {
      window.open(to, newTab ? "_blank" : "_self");
    }
  };

  return (
    <div
      className={cn(
        "absolute right-5 bottom-24 z-30",
        "flex items-center mb-2",
        "rounded-full bg-white shadow-lg",
        "border border-violet-200",
        "transition-all duration-300 ease-out",
        open ? "px-1 py-1" : "px-1",
        className
      )}
    >
      {/* 아이콘 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center justify-center rounded-full",
          "text-violet-600 bg-transparent border-none",
          open ? "px-2" : "px-2 py-2.5"
        )}
        aria-label={open ? "닫기" : "상담 열기"}
      >
        {open ? (
          <FiX size={20} />
        ) : (
          <FiMessageCircle size={20} />
        )}
      </button>

      {/* 링크 버튼 */}
      {open && (
        <button
          type="button"
          onClick={goLink}
          className="whitespace-nowrap text-sm font-bold text-violet-600 hover:underline hover:border-none focus:border-none bg-transparent">
          상담 받아보기
        </button>
      )}
    </div>
  );
}
