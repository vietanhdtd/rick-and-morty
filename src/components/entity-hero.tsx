import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin, Radio, Tv } from 'lucide-react'
import { motion } from 'motion/react'
import { StatusSignal } from '@/components/status-signal'
import type { Character, Episode, Location } from '@/types/rick-and-morty'

export function CharacterSignal({ character }: { character: Character }) {
  return (
    <motion.article
      className="relative flex min-h-76 flex-col justify-end overflow-hidden border border-border bg-canvas-dark p-0 text-content-on-dark"
      layout
    >
      <img
        src={character.image}
        alt={`Portrait of ${character.name}`}
        width={300}
        height={300}
        fetchPriority="high"
      />
      <div className="relative z-10 min-w-0 p-5">
        <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          Character
        </span>
        <StatusSignal status={character.status} />
        <h2 className="my-2 text-[clamp(1.75rem,3vw,2.65rem)] text-content-on-dark">
          {character.name}
        </h2>
        <p className="text-[0.8125rem] leading-relaxed text-content-on-dark-muted">
          {character.origin.name} · {character.episode.length} episodes
        </p>
        <Link
          to="/characters/$characterId"
          params={{ characterId: String(character.id) }}
          aria-label={`View character: ${character.name}`}
          className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-signal hover:underline"
        >
          View character <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}

export function LocationSignal({ location }: { location: Location }) {
  return (
    <motion.article
      className="relative flex min-h-76 flex-col border border-border bg-surface-raised p-5"
      layout
    >
      <div className="mb-auto grid size-11 place-items-center bg-signal-soft text-signal">
        <MapPin aria-hidden="true" />
      </div>
      <div className="relative z-10 min-w-0">
        <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          Place
        </span>
        <h2 className="my-2 text-[clamp(1.75rem,3vw,2.65rem)]">{location.name}</h2>
        <p className="text-[0.8125rem] leading-relaxed text-content-muted">
          {location.type || 'Unknown place'} · {location.dimension}
        </p>
        <small className="text-[0.8125rem] leading-relaxed text-content-muted">
          {location.residents.length} residents
        </small>
        <Link
          to="/locations/$locationId"
          params={{ locationId: String(location.id) }}
          aria-label={`View place: ${location.name}`}
          className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-signal hover:underline"
        >
          View place <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}

export function EpisodeSignal({ episode }: { episode: Episode }) {
  return (
    <motion.article
      className="relative flex min-h-76 flex-col border border-border bg-surface-raised p-5"
      layout
    >
      <div className="mb-auto grid size-11 place-items-center bg-signal-soft text-signal">
        <Tv aria-hidden="true" />
      </div>
      <div className="relative z-10 min-w-0">
        <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          Episode
        </span>
        <h2 className="my-2 text-[clamp(1.75rem,3vw,2.65rem)]">{episode.name}</h2>
        <p className="text-[0.8125rem] leading-relaxed text-content-muted">
          {episode.episode} · {episode.air_date}
        </p>
        <small className="text-[0.8125rem] leading-relaxed text-content-muted">
          {episode.characters.length} characters
        </small>
        <Link
          to="/episodes/$episodeId"
          params={{ episodeId: String(episode.id) }}
          aria-label={`View episode: ${episode.name}`}
          className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-signal hover:underline"
        >
          View episode <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <Radio className="absolute top-5 right-5 text-signal" aria-hidden="true" />
    </motion.article>
  )
}
