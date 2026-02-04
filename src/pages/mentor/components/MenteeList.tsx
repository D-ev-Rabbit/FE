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
      
      <div className="grid grid-cols-[220px_1fr_140px] px-2 text-xs text-gray-400">
        <div>이름</div>
        <div className="text-center">학교/코스</div>
        <div className="text-right">학년/트랙</div>
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
