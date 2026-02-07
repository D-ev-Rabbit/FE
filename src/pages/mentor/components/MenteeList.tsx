import type { MenteeRowData } from "./MenteeRow";
import MenteeRow from "./MenteeRow";

type Props = {
  rows: MenteeRowData[];
  selectedId?: string | null;
  onSelect: (row: MenteeRowData) => void;
};

export default function MenteeList({ rows, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      
      <div className="hidden grid-cols-[170px_1fr_170px] px-2 text-xs text-gray-400 sm:grid">
        <div className="text-center">이름</div>
        <div className="text-center">학교</div>
        <div className="text-center">학년</div>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <MenteeRow
            key={row.id}
            data={row}
            selected={row.id === selectedId}
            onClick={() => onSelect(row)}
          />
        ))}
      </div>
    </div>
  );
}
