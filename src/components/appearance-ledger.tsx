import { Link } from '@tanstack/react-router'
import { CalendarDays, Radio } from 'lucide-react'
import { useState } from 'react'
import type { Episode } from '@/types/rick-and-morty'

const PREVIEW_LIMIT = 12

function episodeOrder(value: string) {
  const match = value.match(/^S(\d+)E(\d+)$/)
  return match ? Number(match[1]) * 1_000 + Number(match[2]) : Number.MAX_SAFE_INTEGER
}

export function AppearanceLedger({ episodes }: { episodes: Episode[] }) {
  const [showAll, setShowAll] = useState(false)
  const orderedEpisodes = [...episodes].sort(
    (left, right) => episodeOrder(left.episode) - episodeOrder(right.episode),
  )
  const visibleEpisodes = showAll ? orderedEpisodes : orderedEpisodes.slice(0, PREVIEW_LIMIT)
  const firstAppearance = orderedEpisodes[0]
  const latestAppearance = orderedEpisodes.at(-1)

  return (
    <section className="mt-12" aria-labelledby="appearance-ledger-heading">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            <Radio size={14} aria-hidden="true" /> Episode appearances
          </p>
          <h2 id="appearance-ledger-heading">Where this character appears.</h2>
        </div>
        <span className="border border-border px-3 py-2 text-[0.625rem] text-content-muted uppercase">
          {orderedEpisodes.length} episodes
        </span>
      </div>

      <div className="mb-3 grid grid-cols-1 border border-border sm:grid-cols-2">
        <article className="flex min-w-0 flex-col gap-2 p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            First appearance
          </span>
          <strong className="text-[1.35rem] text-content">
            {firstAppearance?.episode ?? 'Unknown'}
          </strong>
          {firstAppearance && (
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(firstAppearance.id) }}
              className="break-words font-semibold text-signal"
            >
              {firstAppearance.name}
            </Link>
          )}
        </article>
        <article className="flex min-w-0 flex-col gap-2 border-t border-border p-4 sm:border-t-0 sm:border-l">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Latest appearance
          </span>
          <strong className="text-[1.35rem] text-content">
            {latestAppearance?.episode ?? 'Unknown'}
          </strong>
          {latestAppearance && (
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(latestAppearance.id) }}
              className="break-words font-semibold text-signal"
            >
              {latestAppearance.name}
            </Link>
          )}
        </article>
      </div>

      <ol id="appearance-ledger-list" className="m-0 list-none border-t border-border p-0">
        {visibleEpisodes.map((episode) => (
          <li
            className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 border-b border-border py-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto]"
            key={episode.id}
          >
            <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
              {episode.episode}
            </span>
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(episode.id) }}
              className="break-words font-semibold text-signal"
            >
              {episode.name}
            </Link>
            <small className="col-start-2 inline-flex items-center gap-1 whitespace-nowrap text-[0.625rem] text-content-muted sm:col-auto">
              <CalendarDays size={13} aria-hidden="true" /> {episode.air_date}
            </small>
          </li>
        ))}
      </ol>

      {orderedEpisodes.length > PREVIEW_LIMIT && (
        <button
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-content-secondary transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content-secondary hover:bg-surface-raised active:scale-[0.97] disabled:scale-100"
          type="button"
          aria-expanded={showAll}
          aria-controls="appearance-ledger-list"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? 'Show fewer episodes' : `Show all ${orderedEpisodes.length} episodes`}
        </button>
      )}
    </section>
  )
}
