import { Link } from "react-router-dom";

export default function MentorLoginPage() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-bold">Mentor Login</h1>
      <div className="mt-6 grid gap-3">
        <Link to="/mentor/home" className="rounded-xl bg-black p-3 text-center text-white">
          (임시) 대시보드
        </Link>
        <Link to="/" className="rounded-xl border p-3 text-center">
          뒤로
        </Link>
      </div>
    </div>
  );
}
