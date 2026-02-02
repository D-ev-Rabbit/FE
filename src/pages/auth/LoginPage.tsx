import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <div className="mt-6 grid gap-3">
        <Link to="/mentor/home" className="rounded-xl bg-black p-3 text-center text-white">
          멘토 로그인
        </Link>
        <Link to="/mentee/home" className="rounded-xl border p-3 text-center">
          멘티 로그인
        </Link>
      </div>
    </div>
  );
}
