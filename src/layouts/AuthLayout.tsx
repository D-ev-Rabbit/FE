import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <Outlet />
    </div>
  );
}
