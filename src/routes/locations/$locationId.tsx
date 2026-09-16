import { useQuery } from "@tanstack/react-query";
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

function LocationDetailPage() {
  const { locationId } = Route.useParams();
  const query = useQuery({
    queryKey: queryKeys.entity("location", locationId),
    queryFn: () => getEntity("location", locationId),
  });
  const residentIds =
    query.data?.residents
      .map(idFromApiUrl)
      .filter((id): id is number => id !== null)
      .slice(0, 12) ?? [];
  const residents = useQuery({
    queryKey: ["location-residents", locationId, residentIds],
    queryFn: () => getCharacters(residentIds),
    enabled: residentIds.length > 0,
  });

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
      <div className="mb-5 flex min-h-56 items-end gap-5 border border-border bg-surface-raised p-5 text-content-secondary sm:p-10 dark:border-transparent dark:bg-canvas-dark dark:text-content-on-dark">
        <div className="mb-auto text-signal">
          <MapPinned className="size-12" aria-hidden="true" />
        </div>
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            Place / #{String(location.id).padStart(3, "0")}
          </p>
          <h1 className="my-3 text-[clamp(3rem,6vw,5.5rem)] dark:text-content-on-dark">
            {location.name}
          </h1>
          <p className="text-content-muted dark:text-content-on-dark-muted">
            {location.type || "Unknown place"} in {location.dimension}
          </p>
        </div>
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
        ) : residents.data?.length ? (
          <>
            <RosterReadout
              records={residents.data}
              total={location.residents.length}
              noun="residents"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {residents.data.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                />
              ))}
            </div>
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
