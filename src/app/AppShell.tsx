import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AppShell({ children, className }: Props) {
  return (
    <div className="min-h-dvh w-full bg-gray-100">
      <div className="mx-auto min-h-dvh w-full max-w-[390px] bg-gray-50 md:shadow-[0_18px_60px_rgba(0,0,0,0.12)] md:rounded-2xl md:overflow-hidden">
        <div className={cn("min-h-dvh", className)}>{children}</div>
      </div>
    </div>
  );
}
