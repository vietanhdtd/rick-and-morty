import { Activity, CircleHelp, Skull } from 'lucide-react'
import type { Character } from '@/types/rick-and-morty'

export function RosterReadout({
  records,
  total,
  noun,
}: {
  records: Character[]
  total: number
  noun: string
}) {
  const alive = records.filter((record) => record.status === 'Alive').length
  const dead = records.filter((record) => record.status === 'Dead').length
  const unknown = records.length - alive - dead
  const leadingSpecies = [
    ...records.reduce(
      (counts, record) => counts.set(record.species, (counts.get(record.species) ?? 0) + 1),
      new Map<string, number>(),
    ),
  ].sort((left, right) => right[1] - left[1])[0]

  return (
    <div
      className="-mt-3 mb-4 flex flex-col items-start justify-between gap-4 border border-border bg-signal-soft px-4 py-3 text-[0.6875rem] text-content-secondary sm:flex-row sm:items-center"
      role="status"
      aria-label={`${records.length} of ${total} ${noun} shown`}
    >
      <div className="flex items-center gap-2 text-content">
        <Activity size={15} aria-hidden="true" /> {records.length} of {total} {noun} shown
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="flex items-center gap-2 text-status-alive">{alive} alive</span>
        <span className="flex items-center gap-2 text-status-dead">
          <Skull size={13} aria-hidden="true" /> {dead} dead
        </span>
        {unknown > 0 && (
          <span className="flex items-center gap-2">
            <CircleHelp size={13} aria-hidden="true" /> {unknown} unknown
          </span>
        )}
        {leadingSpecies && (
          <span className="flex items-center gap-2">{leadingSpecies[0]} leads this sample</span>
        )}
      </div>
    </div>
  )
}
