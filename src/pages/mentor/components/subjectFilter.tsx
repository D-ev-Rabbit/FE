import clsx from "clsx"

export type Subject = "ALL" | "KOREAN" | "ENGLISH" | "MATH"

const SUBJECTS: { key: Subject; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "KOREAN", label: "국어" },
  { key: "ENGLISH", label: "영어" },
  { key: "MATH", label: "수학" },
]

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
              "h-12 px-6 rounded-full border",
              "text-base font-medium leading-none",
              "min-w-[72px]",
              "transition-colors",
              active
                ? "border-gray-900 text-gray-900"
                : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
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
