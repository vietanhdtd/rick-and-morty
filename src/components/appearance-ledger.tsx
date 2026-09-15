import { Link } from "@tanstack/react-router";
import { CalendarDays, Radio } from "lucide-react";
import { useState } from "react";
import type { Episode } from "@/types/rick-and-morty";

const PREVIEW_LIMIT = 12;

function episodeOrder(value: string) {
  const match = value.match(/^S(\d+)E(\d+)$/);
  return match
    ? Number(match[1]) * 1_000 + Number(match[2])
    : Number.MAX_SAFE_INTEGER;
}

export function AppearanceLedger({ episodes }: { episodes: Episode[] }) {
  const [showAll, setShowAll] = useState(false);
  const orderedEpisodes = [...episodes].sort(
    (left, right) => episodeOrder(left.episode) - episodeOrder(right.episode),
  );
  const visibleEpisodes = showAll
    ? orderedEpisodes
    : orderedEpisodes.slice(0, PREVIEW_LIMIT);
  const firstAppearance = orderedEpisodes[0];
  const latestAppearance = orderedEpisodes.at(-1);

  return (
    <section
      className="appearance-ledger"
      aria-labelledby="appearance-ledger-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <Radio size={14} /> Episode appearances
          </p>
          <h2 id="appearance-ledger-heading">Where this character appears.</h2>
        </div>
        <span>{orderedEpisodes.length} episodes</span>
      </div>

      <div className="appearance-ledger__summary">
        <article>
          <span>First appearance</span>
          <strong>{firstAppearance?.episode ?? "Unknown"}</strong>
          {firstAppearance && (
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(firstAppearance.id) }}
            >
              {firstAppearance.name}
            </Link>
          )}
        </article>
        <article>
          <span>Latest appearance</span>
          <strong>{latestAppearance?.episode ?? "Unknown"}</strong>
          {latestAppearance && (
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(latestAppearance.id) }}
            >
              {latestAppearance.name}
            </Link>
          )}
        </article>
      </div>

      <ol className="appearance-ledger__list">
        {visibleEpisodes.map((episode) => (
          <li key={episode.id}>
            <span>{episode.episode}</span>
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(episode.id) }}
            >
              {episode.name}
            </Link>
            <small>
              <CalendarDays size={13} aria-hidden="true" /> {episode.air_date}
            </small>
          </li>
        ))}
      </ol>

      {orderedEpisodes.length > PREVIEW_LIMIT && (
        <button
          className="button button--quiet appearance-ledger__toggle"
          type="button"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll
            ? "Show fewer episodes"
            : `Show all ${orderedEpisodes.length} episodes`}
        </button>
      )}
    </section>
  );
}
