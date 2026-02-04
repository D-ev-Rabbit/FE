import { useEffect } from "react";

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

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (closeOnBackdrop ? onClose() : undefined)}
      />
      {/* content */}
      <div className="absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div className="w-full max-h-[85vh] overflow-y-auto sm:w-auto sm:max-h-none">
          {children}
        </div>
      </div>
    </div>
  );
}
