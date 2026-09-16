import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPinned, Users } from "lucide-react";
import {
  getCharacters,
  getEntity,
  idFromApiUrl,
  queryKeys,
} from "@/api/rick-and-morty";
import { CharacterCard } from "@/components/character-card";
import { QueryState } from "@/components/query-state";
import { RosterReadout } from "@/components/roster-readout";

import { useDocumentTitle } from "@/hooks/use-document-title";

function LocationDetailPage() {
  const { locationId } = Route.useParams();
  const query = useQuery({
    queryKey: queryKeys.entity("location", locationId),
    queryFn: () => getEntity("location", locationId),
  });
  useDocumentTitle(query.data?.name);
  const residentIds =
    query.data?.residents
      .map(idFromApiUrl)
      .filter((id): id is number => id !== null) ?? [];

  const residents = useInfiniteQuery({
    queryKey: ["location-residents", locationId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const chunk = residentIds.slice(pageParam, pageParam + 12);
      if (chunk.length === 0) return Promise.resolve([]);
      return getCharacters(chunk);
    },
    getNextPageParam: (_, allPages) => {
      const loadedCount = allPages.flat().length;
      if (loadedCount < residentIds.length) {
        return loadedCount;
      }
      return undefined;
    },
    enabled: residentIds.length > 0,
  });

  const residentList = residents.data?.pages.flat() ?? [];

  if (query.isPending) return <QueryState kind="loading" label="place" />;
  if (query.isError || !query.data)
    return <QueryState kind="error" onRetry={() => query.refetch()} />;

  const location = query.data;
  return (
    <section className="px-4 pt-10 sm:px-8 lg:px-16">
      <Link
        to="/locations"
        className="mb-6 inline-flex items-center gap-2 bg-transparent p-0 text-[0.6875rem] text-content-muted hover:text-signal"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to places
      </Link>
      <div className="mb-5 flex flex-col border border-border bg-surface-raised p-5 text-content-secondary sm:p-8">
        <div className="mb-auto text-signal flex items-end gap-2">
          <MapPinned className="size-8" aria-hidden="true" />
          <p className=" flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            Place / #{String(location.id).padStart(3, "0")}
          </p>
        </div>
        <h1 className="my-3 text-[clamp(3rem,3.5vw,5.5rem)] dark:text-content-on-dark">
          {location.name}
        </h1>
      </div>
      <section
        className="mt-5 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Location facts"
      >
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Dimension
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
            {location.dimension}
          </strong>
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Type
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
            {location.type || "Unknown"}
          </strong>
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Residents
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
            {location.residents.length}
          </strong>
        </article>
      </section>
      <section className="px-0 pt-5" aria-labelledby="residents-heading">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <p className="mb-1 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            <Users size={14} aria-hidden="true" /> Residents
          </p>
        </div>
        {residents.isPending ? (
          <QueryState kind="loading" label="residents" />
        ) : residents.isError ? (
          <QueryState kind="error" onRetry={() => residents.refetch()} />
        ) : residentList.length ? (
          <>
            <RosterReadout
              records={residentList}
              total={location.residents.length}
              noun="residents"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {residentList.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                />
              ))}
            </div>
            {residents.hasNextPage && (
              <button
                className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-signal-ink transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content hover:bg-content active:scale-[0.97] disabled:scale-100"
                type="button"
                onClick={() => residents.fetchNextPage()}
                disabled={residents.isFetchingNextPage}
                aria-busy={residents.isFetchingNextPage}
              >
                {residents.isFetchingNextPage
                  ? "Loading more…"
                  : "Load more residents"}
              </button>
            )}
          </>
        ) : (
          <QueryState kind="empty" label="residents" />
        )}
      </section>
    </section>
  );
}

export const Route = createFileRoute("/locations/$locationId")({
  component: LocationDetailPage,
});
