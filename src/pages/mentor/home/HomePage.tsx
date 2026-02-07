import { useNavigate } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdChecklist, MdOutlineFeedback } from "react-icons/md";

export default function MentorHomePage() {
  const navigate = useNavigate();
  const quickMenus = [
    {
      title: "멘티 관리",
      description: "멘티 목록과 현황을 확인 할 수 있어요.",
      to: "/mentor/mentees",
      icon: <HiOutlineUsers className="h-5 w-5" />,
    },
    {
      title: "플래너 및 과제 관리",
      description: "멘티 과제와 일정을 등록하고 관리할 수 있어요.",
      to: "/mentor/todo",
      icon: <MdChecklist className="h-5 w-5" />,
    },
    {
      title: "피드백",
      description: "멘티 과제 피드백을 작성하고 확인할 수 있어요.",
      to: "/mentor/feedback",
      icon: <MdOutlineFeedback className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* =========================
          빠른 메뉴
         ========================= */}
      <section className="space-y-3">
        {/* 모바일: px-0 / lg: px-4 */}
        <div className="mb-5">
          <div className="text-base font-extrabold text-violet-900">HOME</div>
          <div className="mt-2 text-sm text-gray-500">다양한 기능으로 설스터디를 관리해 보세요.</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-10 pb-10">
          {quickMenus.map((menu) => (
            <button
              key={menu.to}
              type="button"
              onClick={() => navigate(menu.to)}
              className="flex h-full items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left transition hover:border-violet-300 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                {menu.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-gray-900">{menu.title}</div>
                <div className="mt-1 text-xs text-gray-500 leading-4">{menu.description}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
