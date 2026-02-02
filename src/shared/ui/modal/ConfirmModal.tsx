import type { ReactNode } from "react";
import ModalBase from "./ModalBase";
import { IconCheck, IconError, IconInfo } from "./icons";

type Variant = "success" | "error" | "info";

type Props = {
  open: boolean;
  variant: Variant;
  title: string;
  description?: string;

  cancelText?: string;
  confirmText?: string;

  onCancel: () => void;
  onConfirm: () => void;

  /** confirm만 필요한 경우 false로 */
  showCancel?: boolean;
};

const styles: Record<
  Variant,
  {
    ring: string;
    iconWrap: string;
    icon: (cls: string) => ReactNode;
    confirmBtn: string;
  }
> = {
  error: {
    ring: "bg-red-50",
    iconWrap: "bg-red-100 text-red-600",
    icon: (cls) => <IconError className={cls} />,
    confirmBtn: "bg-red-600 hover:bg-red-600/90 text-white",
  },
  success: {
    ring: "bg-green-50",
    iconWrap: "bg-green-100 text-green-600",
    icon: (cls) => <IconCheck className={cls} />,
    confirmBtn: "bg-green-500 hover:bg-green-500/90 text-white",
  },
  info: {
    ring: "bg-yellow-50",
    iconWrap: "bg-yellow-100 text-yellow-600",
    icon: (cls) => <IconInfo className={cls} />,
    confirmBtn: "bg-yellow-400 hover:bg-yellow-400/90 text-black",
  },
};

export default function ConfirmModal({
  open,
  variant,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
  onCancel,
  onConfirm,
  showCancel = true,
}: Props) {
  const s = styles[variant];

  return (
    <ModalBase open={open} onClose={onCancel}>
      <div className="w-full max-w-2xl rounded-3xl bg-white px-10 py-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${s.iconWrap}`}>
            {s.icon("h-7 w-7")}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}

          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            {showCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="h-12 rounded-lg border bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {cancelText}
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onConfirm}
              className={`h-12 rounded-lg text-sm font-semibold ${s.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
