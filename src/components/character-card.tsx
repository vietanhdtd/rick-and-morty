import { Link } from '@tanstack/react-router'
import { Heart, MapPin, Plus } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { StatusSignal } from '@/components/status-signal'
import { useLibraryStore } from '@/store/library'
import type { Character } from '@/types/rick-and-morty'

export function CharacterCard({ character, index = 0 }: { character: Character; index?: number }) {
  const saved = useLibraryStore((state) => Boolean(state.savedCharacters[character.id]))
  const toggle = useLibraryStore((state) => state.toggleCharacter)
  const reducedMotion = useReducedMotion()

  return (
    <motion.article
      className="character-card"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reducedMotion ? 0 : Math.min(index * 0.045, 0.36), duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reducedMotion ? undefined : { y: -7 }}
      layout
    >
      <Link to="/characters/$characterId" params={{ characterId: String(character.id) }} className="character-card__image-link" aria-label={`Open ${character.name}'s archive entry`}>
        <img src={character.image} alt="" className="character-card__image" loading="lazy" />
        <span className="character-card__index">#{String(character.id).padStart(3, '0')}</span>
      </Link>
      <div className="character-card__body">
        <div className="character-card__topline"><StatusSignal status={character.status} /><span>{character.species}</span></div>
        <Link to="/characters/$characterId" params={{ characterId: String(character.id) }} className="character-card__title">{character.name}</Link>
        <p><MapPin size={13} aria-hidden="true" /> {character.location.name}</p>
        <button className={`save-button ${saved ? 'is-saved' : ''}`} type="button" onClick={() => toggle(character)} aria-pressed={saved}>
          {saved ? <Heart size={16} fill="currentColor" /> : <Plus size={16} />} {saved ? 'In library' : 'Save signal'}
        </button>
      </div>
    </motion.article>
  )
}
