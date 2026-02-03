import ModalBase from "@/shared/ui/modal/ModalBase";
import { HiOutlineXMark } from "react-icons/hi2";

type DailyNoteModalProps = {
  open: boolean;
  noteText: string;
  onClose: () => void;
  onChangeNoteText: (value: string) => void;
  onSave: () => void;
};

export default function DailyNoteModal({
  open,
  noteText,
  onClose,
  onChangeNoteText,
  onSave,
}: DailyNoteModalProps) {
  return (
    <ModalBase open={open} onClose={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">오늘의 한마디</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white p-0 text-gray-500 shadow-none"
            aria-label="닫기"
          >
            <HiOutlineXMark className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold text-gray-700">메시지</div>
          <textarea
            value={noteText}
            onChange={(event) => onChangeNoteText(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-violet-400 focus:outline-none"
            placeholder="오늘의 다짐을 입력하세요."
          />
        </div>
        <button
          type="button"
          onClick={onSave}
          className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow"
        >
          저장하기
        </button>
      </div>
    </ModalBase>
  );
}
