import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Radio } from 'lucide-react'
import { motion } from 'motion/react'
import { getEntity, getEpisodes, idFromApiUrl, queryKeys } from '@/api/rick-and-morty'
import { AppearanceLedger } from '@/components/appearance-ledger'
import { CollectionPicker } from '@/components/collection-picker'
import { LibrarySaveButton } from '@/components/library-save-button'
import { QueryState } from '@/components/query-state'
import { StatusSignal } from '@/components/status-signal'

function CharacterDetailPage() {
  const { characterId } = Route.useParams()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const query = useQuery({
    queryKey: queryKeys.entity('character', characterId),
    queryFn: () => getEntity('character', characterId),
  })

  const episodeIds =
    query.data?.episode.map(idFromApiUrl).filter((id): id is number => id !== null) ?? []

  const appearances = useQuery({
    queryKey: ['character-appearances', characterId, episodeIds],
    queryFn: () => getEpisodes(episodeIds),
    enabled: episodeIds.length > 0,
  })

  if (query.isPending) return <QueryState kind="loading" label="character" />
  if (query.isError || !query.data)
    return <QueryState kind="error" onRetry={() => query.refetch()} />

  const character = query.data
  const originId = idFromApiUrl(character.origin.url)
  const locationId = idFromApiUrl(character.location.url)

  function handleBack() {
    if (canGoBack) {
      router.history.back()
      return
    }

    void router.navigate({
      to: '/characters',
      search: { q: '', status: 'all' },
    })
  }

  return (
    <section className="px-4 pt-10 sm:px-8 lg:px-16">
      <button
        className="mb-6 inline-flex items-center gap-2 bg-transparent p-0 text-[0.6875rem] text-content-muted hover:text-signal"
        type="button"
        onClick={handleBack}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {canGoBack ? 'Go back' : 'Back to characters'}
      </button>
      <div className="grid grid-cols-1 gap-5 border-b border-border pb-5 md:grid-cols-[minmax(16rem,.7fr)_minmax(0,1.3fr)] md:items-end">
        <motion.div
          className="relative max-w-72 overflow-hidden border border-border"
          layoutId={`character-avatar-${character.id}`}
          transition={{ type: 'spring', stiffness: 330, damping: 32 }}
        >
          <img
            src={character.image}
            alt={`Portrait of ${character.name}`}
            width={300}
            height={300}
            fetchPriority="high"
            className="aspect-square w-full object-cover"
          />
          <span className="absolute bottom-3 left-3 bg-canvas-dark px-2 py-1 text-[0.6875rem] text-content-on-dark">
            #{String(character.id).padStart(3, '0')}
          </span>
        </motion.div>
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            <Radio size={14} aria-hidden="true" /> Character
          </p>
          <StatusSignal status={character.status} />
          <h1 className="my-3 text-[clamp(3rem,6vw,5.5rem)]">{character.name}</h1>
          <p className="mb-5 text-content-muted">
            {character.type || character.species} · {character.gender}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <LibrarySaveButton character={character} variant="detail" />
            <CollectionPicker character={character} />
          </div>
        </div>
      </div>
      <section
        className="mt-5 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Character facts"
      >
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Origin
          </span>
          {originId ? (
            <Link
              to="/locations/$locationId"
              params={{ locationId: String(originId) }}
              className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-signal"
            >
              {character.origin.name}
            </Link>
          ) : (
            <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
              {character.origin.name}
            </strong>
          )}
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Last location
          </span>
          {locationId ? (
            <Link
              to="/locations/$locationId"
              params={{ locationId: String(locationId) }}
              className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-signal"
            >
              {character.location.name}
            </Link>
          ) : (
            <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
              {character.location.name}
            </strong>
          )}
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Appearances
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
            {character.episode.length} episodes
          </strong>
        </article>
        <article className="flex min-h-28 flex-col justify-between gap-4 border-r border-b border-border p-4">
          <span className="text-[0.625rem] tracking-[.05em] text-content-muted uppercase">
            Species
          </span>
          <strong className="text-[1.2rem] leading-none tracking-[-.04em] break-words text-content">
            {character.species}
          </strong>
        </article>
      </section>
      {appearances.isPending ? (
        <QueryState kind="loading" label="episode appearances" />
      ) : appearances.isError ? (
        <QueryState kind="error" onRetry={() => appearances.refetch()} />
      ) : appearances.data?.length ? (
        <AppearanceLedger episodes={appearances.data} />
      ) : null}
    </section>
  )
}

export const Route = createFileRoute('/characters/$characterId')({
  component: CharacterDetailPage,
})
