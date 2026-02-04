import MenteeRow, { type MenteeRowData } from "./MenteeRow";

interface MenteeTableSectionProps {
  rows: MenteeRowData[];
  onSeeAll?: () => void;
  onShowDetails?: (id: string) => void;
}

export default function MenteeTableSection({
  rows,
  onSeeAll,
  onShowDetails,
}: MenteeTableSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">멘티 목록</h2>

        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs text-primary hover:underline"
        >
          See All
        </button>
      </div>

      <div className="rounded-2xl border bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 border-b px-6 py-3 text-[10px] font-semibold text-muted-foreground">
          <div>INSTRUCTOR NAME &amp; DATE</div>
          <div>COURSE TYPE</div>
          <div>COURSE TITLE</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {rows.map((row) => (
            <MenteeRow key={row.id} data={row} onShowDetails={onShowDetails} />
          ))}
        </div>
      </div>
    </section>
  );
}
