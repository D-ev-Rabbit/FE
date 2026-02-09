import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
};

export default function ModalBase({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (closeOnBackdrop ? onClose() : undefined)}
      />
      {/* content */}
      <div className="absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="mx-auto w-full max-h-[85vh] overflow-y-auto sm:w-auto sm:max-h-none">
          {children}
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
