import clsx from "clsx"

export type Subject = "ALL" | "KOREAN" | "ENGLISH" | "MATH"

const SUBJECTS: { key: Subject; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "KOREAN", label: "국어" },
  { key: "ENGLISH", label: "영어" },
  { key: "MATH", label: "수학" },
]

const subjectChipClass = (key: Subject, active: boolean) => {
  if (!active) return "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800";
  if (key === "KOREAN") return "border-yellow-300 bg-yellow-50 text-yellow-800";
  if (key === "ENGLISH") return "border-rose-300 bg-rose-50 text-rose-800";
  if (key === "MATH") return "border-indigo-300 bg-indigo-50 text-indigo-800";
  return "border-gray-900 text-gray-900";
};

type Props = {
  value: Subject
  onChange: (next: Subject) => void
  className?: string
}

export default function SubjectFilter({ value, onChange, className }: Props) {
  return (
    <div className={clsx("flex gap-3", className)}>
      {SUBJECTS.map((s) => {
        const active = value === s.key
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={clsx(
              "inline-flex items-center justify-center whitespace-nowrap",
              "h-7 px-5 rounded-full border",
              "text-sm font-semibold leading-none",
              "min-w-[64px]",
              "transition-colors",
              subjectChipClass(s.key, active)
            )}
            aria-pressed={active}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
