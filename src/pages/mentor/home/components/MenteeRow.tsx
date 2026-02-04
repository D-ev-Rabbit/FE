import clsx from "clsx";

export type MenteeRowData = {
  id: string;
  name: string;
  date: string; // 예: "25/2/2023"
  avatarUrl?: string;
  courseType: string; // 예: "FRONTEND"
  courseTitle: string; // 예: "Understanding Concept Of React"
};

interface MenteeRowProps {
  data: MenteeRowData;
  onShowDetails?: (id: string) => void;
}

export default function MenteeRow({ data, onShowDetails }: MenteeRowProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr_2fr_1fr] items-center gap-4 px-6 py-4">
      {/* INSTRUCTOR NAME & DATE */}
      <div className="flex items-center gap-3">
        {data.avatarUrl ? (
          <img
            src={data.avatarUrl}
            alt={data.name}
            className="h-9 w-9 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {data.name.slice(0, 1)}
          </div>
        )}

        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">{data.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{data.date}</p>
        </div>
      </div>

      {/* COURSE TYPE */}
      <div>
        <span
          className={clsx(
            "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide",
            "bg-primary/10 text-primary"
          )}
        >
          {data.courseType}
        </span>
      </div>

      {/* COURSE TITLE */}
      <div className="text-sm text-foreground">{data.courseTitle}</div>

      {/* ACTIONS */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onShowDetails?.(data.id)}
          className={clsx(
            "rounded-full px-3 py-1 text-[10px] font-semibold",
            "bg-primary/10 text-primary hover:bg-primary/15 transition"
          )}
        >
          SHOW DETAILS
        </button>
      </div>
    </div>
  );
}
