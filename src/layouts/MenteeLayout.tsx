import { Outlet } from "react-router-dom";

export default function MenteeLayout() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 border-b bg-white p-4 font-semibold">
        MO Header
      </header>
      <main className="p-4 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        MO Bottom Nav
      </nav>
    </div>
  );
}
