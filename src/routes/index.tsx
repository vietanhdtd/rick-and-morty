import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { getRandomSignal, queryKeys } from '@/api/rick-and-morty'
import { CharacterCard } from '@/components/character-card'
import { EpisodeSignal, LocationSignal } from '@/components/entity-hero'
import { QueryState } from '@/components/query-state'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useHomeStore } from '@/store/home'

function HomePage() {
  useDocumentTitle('Discover')
  const characterRefresh = useHomeStore((state) => state.characterRefresh)
  const refreshCharacter = useHomeStore((state) => state.refreshCharacter)

  const reducedMotion = useReducedMotion()
  const character = useQuery({
    queryKey: queryKeys.signal('character', characterRefresh),
    queryFn: () => getRandomSignal('character'),
    placeholderData: (previous) => previous,
  })
  const location = useQuery({
    queryKey: queryKeys.signal('location', 0),
    queryFn: () => getRandomSignal('location'),
  })
  const episode = useQuery({
    queryKey: queryKeys.signal('episode', 0),
    queryFn: () => getRandomSignal('episode'),
  })
  const suggestions = useQuery({
    queryKey: ['suggestions', 'home'],
    queryFn: () =>
      Promise.all([
        getRandomSignal('character'),
        getRandomSignal('character'),
        getRandomSignal('character'),
      ]),
  })
  const supportingLoading = location.isPending || episode.isPending

  return (
    <>
      <section
        className="relative grid min-h-dvh grid-cols-1 content-center gap-8 overflow-hidden border-b border-border bg-surface px-4 py-28 sm:gap-12 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 lg:px-16"
        aria-labelledby="home-stage-heading"
      >
        {/* <div className="absolute inset-x-4 top-5 flex items-center justify-between sm:inset-x-8 lg:inset-x-16"></div> */}
        <motion.div
          className="relative z-10 min-w-0"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex w-fit items-center gap-2 leading-[.8] tracking-[-0.06em] text-content uppercase mb-5">
            <span className="grid size-8 place-items-center rounded-md bg-signal text-signal-ink">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            <span>Rick and Morty Multiverse Guide</span>
          </div>
          <h1
            className="mb-5 text-[clamp(3rem,3.5vw,5.8rem)] leading-[.94]"
            id="home-stage-heading"
          >
            Meet someone <em className="text-signal">unexpected.</em>
          </h1>
          <p className="mb-6 max-w-[47ch] text-[0.875rem] text-content-secondary">
            Start with one random character, then follow their locations and episode appearances
            through the universe.
          </p>
          <motion.button
            className="inline-flex min-h-11 min-w-[min(100%,18rem)] items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-signal-ink transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content hover:bg-content active:scale-[0.97] disabled:scale-100"
            type="button"
            onClick={() => refreshCharacter()}
            disabled={character.isFetching}
            aria-busy={character.isFetching}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            {character.isFetching ? 'Finding someone…' : 'Meet someone else'}
            <Sparkles size={15} aria-hidden="true" />
          </motion.button>
        </motion.div>

        <div
          className="relative z-10 min-w-0 [&>div>article]:grid [&>div>article]:min-h-[min(32rem,calc(100svh-12rem))] [&>div>article]:grid-cols-1 [&>div>article]:md:grid-cols-[1.12fr_.88fr] [&>div>article>a]:h-full [&>div>article>a]:min-h-80 [&>div>article>div]:self-end [&>div>article>div]:p-5 lg:[&>div>article>div]:p-6"
          aria-live="polite"
        >
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
                transition={{
                  duration: reducedMotion ? 0.12 : 0.24,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <CharacterCard character={character.data} index={0} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <section className="px-4 pt-12 sm:px-8 lg:px-16" aria-labelledby="signals-heading">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
              Keep exploring
            </p>
            <h2
              className="mb-0 max-w-[20ch] text-[clamp(1.75rem,4vw,3.25rem)]"
              id="signals-heading"
            >
              Places and episodes.
            </h2>
          </div>
          <span
            className="border border-border px-3 py-2 text-[0.625rem] text-content-muted uppercase"
            role="status"
            aria-live="polite"
          >
            {supportingLoading ? 'Loading' : 'Ready'}
          </span>
        </div>
        {supportingLoading ? (
          <QueryState kind="loading" label="guide" />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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

      <section className="px-4 pt-12 sm:px-8 lg:px-16" aria-labelledby="suggestions-heading">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
              Character picks
            </p>
            <h2
              className="mb-0 max-w-[20ch] text-[clamp(1.75rem,4vw,3.25rem)]"
              id="suggestions-heading"
            >
              A few places to start.
            </h2>
          </div>
        </div>
        {suggestions.isPending ? (
          <QueryState kind="loading" label="character" />
        ) : suggestions.isError ? (
          <QueryState kind="error" onRetry={() => suggestions.refetch()} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.data?.map((entry, index) => (
              <CharacterCard key={`${entry.id}-${index}`} character={entry} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export const Route = createFileRoute('/')({ component: HomePage })
