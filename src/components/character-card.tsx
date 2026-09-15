import { Link } from "@tanstack/react-router";
import { ListMinus, MapPin, Radio } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LibrarySaveButton } from "@/components/library-save-button";
import { StatusSignal } from "@/components/status-signal";
import { useLibraryStore } from "@/store/library";
import type { Character } from "@/types/rick-and-morty";

export function CharacterCard({
  character,
  index = 0,
  collectionId,
}: {
  character: Character;
  index?: number;
  collectionId?: string;
}) {
  const reducedMotion = useReducedMotion();
  const removeCharacterFromCollection = useLibraryStore(
    (state) => state.removeCharacterFromCollection,
  );

  return (
    <motion.article
      className="character-card"
      initial={
        reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: reducedMotion ? 0 : Math.min(index * 0.045, 0.36),
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
    >
      <Link
        to="/characters/$characterId"
        params={{ characterId: String(character.id) }}
        className="character-card__image-link"
        aria-label={`View ${character.name}`}
      >
        <motion.span
          className="character-card__avatar"
          layoutId={`character-avatar-${character.id}`}
          transition={{ type: "spring", stiffness: 330, damping: 32 }}
        >
          <img
            src={character.image}
            alt=""
            className="character-card__image"
            width={300}
            height={300}
            loading="lazy"
          />
        </motion.span>
        <span className="character-card__index">
          #{String(character.id).padStart(3, "0")}
        </span>
      </Link>
      <div className="character-card__body">
        <div className="character-card__topline">
          <StatusSignal status={character.status} />
          <span>{character.species}</span>
        </div>
        <Link
          to="/characters/$characterId"
          params={{ characterId: String(character.id) }}
          className="character-card__title"
        >
          {character.name}
        </Link>
        <p>
          <MapPin size={13} aria-hidden="true" /> {character.location.name}
        </p>
        <p className="character-card__record">
          <Radio size={13} aria-hidden="true" /> {character.episode.length}{" "}
          {character.episode.length === 1 ? "episode appearance" : "episode appearances"}
        </p>
        <LibrarySaveButton character={character} />
        {collectionId ? (
          <button
            className="character-card__remove-from-list"
            type="button"
            onClick={() => removeCharacterFromCollection(collectionId, character.id)}
          >
            <ListMinus size={14} /> Remove from this list
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}
