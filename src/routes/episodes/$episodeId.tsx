import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clapperboard, Users } from "lucide-react";
import {
  getCharacters,
  getEntity,
  idFromApiUrl,
  queryKeys,
} from "@/api/rick-and-morty";
import { CharacterCard } from "@/components/character-card";
import { QueryState } from "@/components/query-state";
import { RosterReadout } from "@/components/roster-readout";

function EpisodeDetailPage() {
  const { episodeId } = Route.useParams();
  const query = useQuery({
    queryKey: queryKeys.entity("episode", episodeId),
    queryFn: () => getEntity("episode", episodeId),
  });
  const characterIds =
    query.data?.characters
      .map(idFromApiUrl)
      .filter((id): id is number => id !== null) ?? [];

  const cast = useInfiniteQuery({
    queryKey: ["episode-cast", episodeId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const chunk = characterIds.slice(pageParam, pageParam + 12);
      if (chunk.length === 0) return Promise.resolve([]);
      return getCharacters(chunk);
    },
    getNextPageParam: (_, allPages) => {
      const loadedCount = allPages.flat().length;
      if (loadedCount < characterIds.length) {
        return loadedCount;
      }
      return undefined;
    },
    enabled: characterIds.length > 0,
  });

  const castList = cast.data?.pages.flat() ?? [];

  if (query.isPending) return <QueryState kind="loading" label="episode" />;
  if (query.isError || !query.data)
    return <QueryState kind="error" onRetry={() => query.refetch()} />;
  const episode = query.data;

  return (
    <section className="px-4 pt-10 sm:px-8 lg:px-16">
      <Link
        to="/episodes"
        className="mb-6 inline-flex items-center gap-2 bg-transparent p-0 text-[0.6875rem] text-content-muted hover:text-signal"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to episodes
      </Link>
      <div className="mb-5 flex min-h-56 items-end gap-5 border border-border bg-surface-raised p-5 text-content-secondary sm:p-10">
        <div className="mb-auto text-signal">
          <Clapperboard className="size-12" aria-hidden="true" />
        </div>
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            Episode / {episode.episode}
          </p>
          <h1 className="my-3 text-[clamp(3rem,6vw,5.5rem)] dark:text-content-on-dark">
            {episode.name}
          </h1>
          <p className="text-content-muted dark:text-content-on-dark-muted">
            Aired {episode.air_date}
          </p>
        </div>
      </div>
      <section
        className="mt-5 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Episode facts"
      >
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-wider text-content-muted uppercase">
            Episode code
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] wrap-break-word text-content">
            {episode.episode}
          </strong>
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-wider text-content-muted uppercase">
            Air date
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] wrap-break-word text-content">
            {episode.air_date}
          </strong>
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-wider text-content-muted uppercase">
            Cast
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] wrap-break-word text-content">
            {episode.characters.length} characters
          </strong>
        </article>
      </section>
      <section className="px-0 pt-12" aria-labelledby="cast-heading">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
              <Users size={14} aria-hidden="true" /> Cast
            </p>
            <h2
              className="mb-0 max-w-[20ch] text-[clamp(1.75rem,4vw,3.25rem)]"
              id="cast-heading"
            >
              Characters in this episode.
            </h2>
          </div>
        </div>
        {cast.isPending ? (
          <QueryState kind="loading" label="character" />
        ) : cast.isError ? (
          <QueryState kind="error" onRetry={() => cast.refetch()} />
        ) : castList.length ? (
          <>
            <RosterReadout
              records={castList}
              total={episode.characters.length}
              noun="cast members"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {castList.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                />
              ))}
            </div>
            {cast.hasNextPage && (
              <button
                className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-signal-ink transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content hover:bg-content active:scale-[0.97] disabled:scale-100"
                type="button"
                onClick={() => cast.fetchNextPage()}
                disabled={cast.isFetchingNextPage}
                aria-busy={cast.isFetchingNextPage}
              >
                {cast.isFetchingNextPage
                  ? "Loading more…"
                  : "Load more characters"}
              </button>
            )}
          </>
        ) : (
          <QueryState kind="empty" label="character" />
        )}
      </section>
    </section>
  );
}

export const Route = createFileRoute("/episodes/$episodeId")({
  component: EpisodeDetailPage,
});
