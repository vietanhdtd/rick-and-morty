import { Activity, CircleHelp, Skull } from "lucide-react";
import type { Character } from "@/types/rick-and-morty";

export function RosterReadout({
  records,
  total,
  noun,
}: {
  records: Character[];
  total: number;
  noun: string;
}) {
  const alive = records.filter((record) => record.status === "Alive").length;
  const dead = records.filter((record) => record.status === "Dead").length;
  const unknown = records.length - alive - dead;
  const leadingSpecies = [
    ...records.reduce(
      (counts, record) =>
        counts.set(record.species, (counts.get(record.species) ?? 0) + 1),
      new Map<string, number>(),
    ),
  ].sort((left, right) => right[1] - left[1])[0];

  return (
    <div
      className="roster-readout"
      role="status"
      aria-label={`${records.length} of ${total} ${noun} shown`}
    >
      <div className="roster-readout__coverage">
        <Activity size={15} /> {records.length} of {total} {noun} shown
      </div>
      <div className="roster-readout__signals">
        <span className="roster-readout__alive">{alive} alive</span>
        <span className="roster-readout__dead">
          <Skull size={13} /> {dead} dead
        </span>
        {unknown > 0 && (
          <span>
            <CircleHelp size={13} /> {unknown} unknown
          </span>
        )}
        {leadingSpecies && <span>{leadingSpecies[0]} leads this sample</span>}
      </div>
    </div>
  );
}
