import { useEffect, useMemo, useRef, useState } from "react"
import ModalBase from "@/shared/ui/modal/ModalBase"
import type { TodoItem } from "./TodoListTable"
import { FiUpload } from "react-icons/fi"

type Props = {
  open: boolean
  mode: "create" | "edit"
  initial?: TodoItem | null
  onClose: () => void
  onSave: (payload: { title: string; date: string; subject: TodoItem["subject"] }) => void
  onDelete?: () => void
}

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export default function TodoEditModal({ open, mode, initial, onClose, onSave, onDelete }: Props) {
  const defaultDate = useMemo(() => (initial?.date ? initial.date : toYmd(new Date())), [initial])

  const [title, setTitle] = useState("")
  const [date, setDate] = useState(defaultDate)
  const [subject, setSubject] = useState<TodoItem["subject"]>(initial?.subject ?? "KOREAN")

  // ✅ 파일 선택 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    setTitle(initial?.title ?? "")
    setDate(initial?.date ?? defaultDate)
    setSubject(initial?.subject ?? "KOREAN")

    // ✅ 모달 열릴 때마다 파일 선택 초기화
    setSelectedFile(null)
  }, [open, initial, defaultDate])

  const canSave = title.trim().length > 0 && date.length === 10

  const openFilePicker = () => fileRef.current?.click()

  return (
    <ModalBase open={open} onClose={onClose}>
      <div className="w-[min(560px,92vw)] rounded-3xl bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="text-base font-extrabold text-gray-900">
            {mode === "create" ? "할 일 추가" : "할 일 수정"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* 이름 */}
          <label className="block">
            <div className="mb-2 text-sm font-semibold text-gray-700">할 일 이름</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 비문학 3지문"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </label>

          {/* 날짜 */}
          <label className="block">
            <div className="mb-2 text-sm font-semibold text-gray-700">날짜</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </label>

          {/* 과목 */}
          <div>
            <div className="mb-2 text-sm font-semibold text-gray-700 pt-2">과목</div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["KOREAN", "국어"],
                  ["ENGLISH", "영어"],
                  ["MATH", "수학"],
                ] as const
              ).map(([key, label]) => {
                const active = subject === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSubject(key)}
                    className={[
                      "h-10 rounded-full border px-4 text-sm font-semibold transition",
                      active
                        ? "border-violet-600 bg-violet-50 text-violet-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ✅ 파일 업로드(선택) UI */}
          <div>
            <div className="mb-2 text-sm font-semibold text-gray-700 pt-2">과제 파일</div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openFilePicker}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                <FiUpload className="h-4 w-4" />
                파일 선택
              </button>

              {/* 파일명 표시 칸 */}
              <div
                className={[
                  "w-full flex-1 rounded-xl border px-4 py-3 text-sm",
                  selectedFile ? "border-gray-200 text-gray-900" : "border-dashed border-gray-200 text-gray-400",
                ].join(" ")}
              >
                {selectedFile ? selectedFile.name : "선택된 파일 없음"}
              </div>

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
                >
                  제거
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setSelectedFile(file)
                  e.currentTarget.value = "" // 같은 파일 재선택 가능
                }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              {/* * 파일 업로드 API 연결은 다음 단계에서 저장 후(todo_id 생성) 진행. */}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {mode === "edit" ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              삭제
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => onSave({ title: title.trim(), date, subject })}
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  )
}
