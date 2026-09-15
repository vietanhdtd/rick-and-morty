import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin, Radio, Tv } from 'lucide-react'
import { motion } from 'motion/react'
import { StatusSignal } from '@/components/status-signal'
import type { Character, Episode, Location } from '@/types/rick-and-morty'

export function CharacterSignal({ character }: { character: Character }) {
  return <motion.article className="signal-card signal-card--character" layout><img src={character.image} alt="" width={300} height={300} fetchPriority="high" /><div className="signal-card__content"><span className="eyebrow">Character</span><StatusSignal status={character.status} /><h2>{character.name}</h2><p>{character.origin.name} · {character.episode.length} episodes</p><Link to="/characters/$characterId" params={{ characterId: String(character.id) }}>View character <ArrowUpRight size={16} /></Link></div></motion.article>
}

export function LocationSignal({ location }: { location: Location }) {
  return <motion.article className="signal-card signal-card--location" layout><div className="signal-icon"><MapPin /></div><div className="signal-card__content"><span className="eyebrow">Place</span><h2>{location.name}</h2><p>{location.type || 'Unknown place'} · {location.dimension}</p><small>{location.residents.length} residents</small><Link to="/locations/$locationId" params={{ locationId: String(location.id) }}>View place <ArrowUpRight size={16} /></Link></div></motion.article>
}

export function EpisodeSignal({ episode }: { episode: Episode }) {
  return <motion.article className="signal-card signal-card--episode" layout><div className="signal-icon"><Tv /></div><div className="signal-card__content"><span className="eyebrow">Episode</span><h2>{episode.name}</h2><p>{episode.episode} · {episode.air_date}</p><small>{episode.characters.length} characters</small><Link to="/episodes/$episodeId" params={{ episodeId: String(episode.id) }}>View episode <ArrowUpRight size={16} /></Link></div><Radio className="signal-card__radio" aria-hidden="true" /></motion.article>
}
