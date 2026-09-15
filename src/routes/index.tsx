import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CharacterCard } from "@/components/character-card";
import { EpisodeSignal, LocationSignal } from "@/components/entity-hero";
import { QueryState } from "@/components/query-state";
import { getRandomSignal, queryKeys } from "@/api/rick-and-morty";
import { useState } from "react";

function HomePage() {
  const [characterRefresh, setCharacterRefresh] = useState(0);
  const reducedMotion = useReducedMotion();
  const character = useQuery({
    queryKey: queryKeys.signal("character", characterRefresh),
    queryFn: () => getRandomSignal("character"),
    placeholderData: (previous) => previous,
  });
  const location = useQuery({
    queryKey: queryKeys.signal("location", 0),
    queryFn: () => getRandomSignal("location"),
  });
  const episode = useQuery({
    queryKey: queryKeys.signal("episode", 0),
    queryFn: () => getRandomSignal("episode"),
  });
  const suggestions = useQuery({
    queryKey: ["suggestions", "home"],
    queryFn: () =>
      Promise.all([
        getRandomSignal("character"),
        getRandomSignal("character"),
        getRandomSignal("character"),
      ]),
  });
  const supportingLoading = location.isPending || episode.isPending;

  return (
    <>
      <section className="home-stage" aria-labelledby="home-stage-heading">
        <div className="home-stage__brandbar">
          <div className="brand">
            <span className="brand__mark"><Sparkles size={16} aria-hidden="true" /></span>
            <span>Multiverse<br />Guide</span>
          </div>
        </div>
        <motion.div
          className="home-stage__intro"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow"><Zap size={14} /> Rick and Morty guide</p>
          <h1 id="home-stage-heading">
            Meet someone <em>unexpected.</em>
          </h1>
          <p className="home-stage__lede">
            Start with one random character, then follow their locations and
            episode appearances through the universe.
          </p>
          <motion.button
            className="button button--random"
            type="button"
            onClick={() => setCharacterRefresh((value) => value + 1)}
            disabled={character.isFetching}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            <RefreshCw size={17} className={character.isFetching ? "spin" : ""} />
            {character.isFetching ? "Finding someone…" : "Show another character"}
            <Sparkles size={15} aria-hidden="true" />
          </motion.button>
        </motion.div>

        <div className="home-featured" aria-live="polite">
          {character.isPending ? (
            <QueryState kind="loading" label="character" />
          ) : character.isError || !character.data ? (
            <QueryState kind="error" onRetry={() => character.refetch()} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={character.data.id}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -14, scale: 0.985 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <CharacterCard character={character.data} index={0} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <section className="signal-section" aria-labelledby="signals-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep exploring</p>
            <h2 id="signals-heading">Places and episodes.</h2>
          </div>
          <span>{supportingLoading ? "Loading" : "Ready"}</span>
        </div>
        {supportingLoading ? (
          <QueryState kind="loading" label="guide" />
        ) : (
          <div className="signal-grid signal-grid--supporting">
              {location.data ? (
                <LocationSignal location={location.data} />
              ) : (
                <QueryState kind="error" onRetry={() => location.refetch()} />
              )}
              {episode.data ? (
                <EpisodeSignal episode={episode.data} />
              ) : (
                <QueryState kind="error" onRetry={() => episode.refetch()} />
              )}
          </div>
        )}
      </section>

      <section
        className="suggestion-section"
        aria-labelledby="suggestions-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Character picks</p>
            <h2 id="suggestions-heading">A few places to start.</h2>
          </div>
        </div>
        {suggestions.isPending ? (
          <QueryState kind="loading" label="character" />
        ) : suggestions.isError ? (
          <QueryState kind="error" onRetry={() => suggestions.refetch()} />
        ) : (
          <div className="character-grid">
            {suggestions.data?.map((entry, index) => (
              <CharacterCard
                key={`${entry.id}-${index}`}
                character={entry}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export const Route = createFileRoute("/")({ component: HomePage });
