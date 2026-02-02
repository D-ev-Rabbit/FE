import { Outlet } from "react-router-dom";

export default function MentorLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b p-4 font-semibold">PC Header</header>
      <main className="p-4">
        <Outlet />
      </main>
      <footer className="border-t p-4 text-sm text-gray-500">PC Footer</footer>
    </div>
  );
}
