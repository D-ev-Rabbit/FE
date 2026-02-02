import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-gray-50 p-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold">404</h1>
        <p className="mt-2 text-gray-500">페이지를 찾을 수 없어요.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-white"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
