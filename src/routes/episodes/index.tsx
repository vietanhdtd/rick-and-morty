import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, Radio } from "lucide-react";
import { useState } from "react";
import { getPage, queryKeys } from "@/api/rick-and-morty";
import { QueryState } from "@/components/query-state";

function EpisodesPage() {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: queryKeys.page("episode", { page }),
    queryFn: () => getPage("episode", { page }),
  });
  if (query.isPending) return <QueryState kind="loading" label="episode" />;
  if (query.isError || !query.data)
    return <QueryState kind="error" onRetry={() => query.refetch()} />;
  return (
    <section className="px-4 pt-12 sm:px-8 lg:px-16">
      <header className="mb-6 max-w-3xl">
        <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          Episodes / {query.data.info.count} total
        </p>
        <h1 className="mb-4 text-[clamp(2.6rem,6vw,5.7rem)]">
          Every episode, in one place.
        </h1>
        <p className="max-w-[52ch] text-content-secondary">
          Browse the episodes and use each cast list to find your next
          character.
        </p>
      </header>
      <div className="border-t border-border">
        {query.data.results.map((episode) => (
          <article
            className="grid grid-cols-[4.5rem_minmax(0,1fr)_1.5rem] items-center gap-2 border-b border-border py-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto_2rem] sm:gap-4"
            key={episode.id}
          >
            <div className="flex items-center gap-2 text-[0.6875rem]">
              <Clapperboard size={18} aria-hidden="true" />
              <span>{episode.episode}</span>
            </div>
            <div>
              <Link
                to="/episodes/$episodeId"
                params={{ episodeId: String(episode.id) }}
                aria-label={`View episode: ${episode.name}`}
              >
                <h2 className="mb-1 text-signal text-xl hover:underline">
                  {episode.name}
                </h2>
              </Link>
              <p className="text-[0.75rem] text-content-muted">
                Air date: {episode.air_date}
              </p>
            </div>
            <div className="hidden items-center gap-1 text-[0.75rem] text-content-muted sm:flex">
              <Radio size={14} aria-hidden="true" /> {episode.characters.length}{" "}
              characters
            </div>
            <Link
              to="/episodes/$episodeId"
              params={{ episodeId: String(episode.id) }}
              aria-label={`View episode: ${episode.name}`}
              className="text-signal"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
      <nav
        className="mt-8 flex items-center justify-center gap-4 text-[0.6875rem] text-content-muted"
        aria-label="Episodes pagination"
      >
        <button
          type="button"
          className="min-h-10 rounded-md border border-border-strong px-3 py-2 text-content-secondary"
          disabled={!query.data.info.prev}
          aria-label="Previous page"
          onClick={() => setPage((value) => value - 1)}
        >
          Previous
        </button>
        <span aria-current="page" role="status" aria-live="polite">
          Page {page} of {query.data.info.pages}
        </span>
        <button
          type="button"
          className="min-h-10 rounded-md border border-border-strong px-3 py-2 text-content-secondary"
          disabled={!query.data.info.next}
          aria-label="Next page"
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </nav>
    </section>
  );
}

export const Route = createFileRoute("/episodes/")({ component: EpisodesPage });
