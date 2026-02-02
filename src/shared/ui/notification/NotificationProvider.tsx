import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import NotificationHost from "@/shared/ui/notification/NotificationHost";
import type { Notice, NoticeVariant } from "@/shared/ui/notification/NotificationHost";

type NotifyFn = (n: Omit<Notice, "id">) => void;

type NotifyAPI = {
  push: NotifyFn;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const Ctx = createContext<NotifyAPI | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Notice[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push: NotifyFn = useCallback((n) => {
    const id = uid();
    const item: Notice = { id, ...n };

    setItems((prev) => [item, ...prev].slice(0, 3)); // 최대 3개
    const ttl = n.ttlMs ?? 2500;
    window.setTimeout(() => remove(id), ttl);
  }, [remove]);

  const api = useMemo<NotifyAPI>(() => ({
    push,
    success: (title, message) => push({ variant: "success", title, message }),
    error: (title, message) => push({ variant: "error", title, message }),
    info: (title, message) => push({ variant: "info", title, message }),
  }), [push]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <NotificationHost items={items} onClose={remove} />
    </Ctx.Provider>
  );
}

export function useNotify() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNotify must be used within NotificationProvider");
  return v;
}

export type { NoticeVariant };
