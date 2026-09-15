import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "motion/react";
import {
  getEntity,
  getEpisodes,
  idFromApiUrl,
  queryKeys,
} from "@/api/rick-and-morty";
import { AppearanceLedger } from "@/components/appearance-ledger";
import { CollectionPicker } from "@/components/collection-picker";
import { LibrarySaveButton } from "@/components/library-save-button";
import { QueryState } from "@/components/query-state";
import { StatusSignal } from "@/components/status-signal";

function CharacterDetailPage() {
  const { characterId } = Route.useParams();
  const query = useQuery({
    queryKey: queryKeys.entity("character", characterId),
    queryFn: () => getEntity("character", characterId),
  });

  const episodeIds =
    query.data?.episode
      .map(idFromApiUrl)
      .filter((id): id is number => id !== null) ?? [];

  const appearances = useQuery({
    queryKey: ["character-appearances", characterId, episodeIds],
    queryFn: () => getEpisodes(episodeIds),
    enabled: episodeIds.length > 0,
  });

  if (query.isPending) return <QueryState kind="loading" label="character" />;
  if (query.isError || !query.data)
    return <QueryState kind="error" onRetry={() => query.refetch()} />;

  const character = query.data;
  const originId = idFromApiUrl(character.origin.url);
  const locationId = idFromApiUrl(character.location.url);

  return (
    <section className="detail-page">
      <Link
        to="/characters"
        search={{ q: "", status: "all" }}
        className="back-link"
      >
        <ArrowLeft size={16} /> Back to characters
      </Link>
      <div className="detail-hero">
        <motion.div
          className="detail-hero__portrait"
          layoutId={`character-avatar-${character.id}`}
          transition={{ type: "spring", stiffness: 330, damping: 32 }}
        >
          <img
            src={character.image}
            alt=""
            width={300}
            height={300}
            fetchPriority="high"
          />
          <span>#{String(character.id).padStart(3, "0")}</span>
        </motion.div>
        <div>
          <p className="eyebrow">
            <Radio size={14} /> Character
          </p>
          <StatusSignal status={character.status} />
          <h1>{character.name}</h1>
          <p className="detail-hero__type">
            {character.type || character.species} · {character.gender}
          </p>
          <div className="detail-hero__actions">
            <LibrarySaveButton character={character} variant="detail" />
            <CollectionPicker character={character} />
          </div>
        </div>
      </div>
      <div className="fact-grid">
        <article>
          <span>Origin</span>
          {originId ? (
            <Link
              to="/locations/$locationId"
              params={{ locationId: String(originId) }}
            >
              {character.origin.name}
            </Link>
          ) : (
            <strong>{character.origin.name}</strong>
          )}
        </article>
        <article>
          <span>Last location</span>
          {locationId ? (
            <Link
              to="/locations/$locationId"
              params={{ locationId: String(locationId) }}
            >
              {character.location.name}
            </Link>
          ) : (
            <strong>{character.location.name}</strong>
          )}
        </article>
        <article>
          <span>Appearances</span>
          <strong>{character.episode.length} episodes</strong>
        </article>
        <article>
          <span>Species</span>
          <strong>{character.species}</strong>
        </article>
      </div>
      {appearances.isPending ? (
        <QueryState kind="loading" label="episode appearances" />
      ) : appearances.isError ? (
        <QueryState kind="error" onRetry={() => appearances.refetch()} />
      ) : appearances.data?.length ? (
        <AppearanceLedger episodes={appearances.data} />
      ) : null}
    </section>
  );
}

export const Route = createFileRoute("/characters/$characterId")({
  component: CharacterDetailPage,
});
