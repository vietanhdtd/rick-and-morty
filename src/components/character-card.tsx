import { Link } from "@tanstack/react-router";
import { ListMinus, MapPin, Radio } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LibrarySaveButton } from "@/components/library-save-button";
import { StatusSignal } from "@/components/status-signal";
import { useLibraryStore } from "@/store/library";
import type { Character } from "@/types/rick-and-morty";

const characterCardVariants = {
  default: {
    card: "",
    image: "h-64",
    content: "p-4",
  },
  featured: {
    card: "grid min-h-[min(28rem,calc(100svh-12rem))] grid-cols-1 md:grid-cols-[1.12fr_.88fr]",
    image: "h-full min-h-72",
    content: "self-start p-5 lg:p-6",
  },
} as const;

type CharacterCardVariant = keyof typeof characterCardVariants;

export function CharacterCard({
  character,
  index = 0,
  collectionId,
  variant = "default",
}: {
  character: Character;
  index?: number;
  collectionId?: string;
  variant?: CharacterCardVariant;
}) {
  const reducedMotion = useReducedMotion();
  const styles = characterCardVariants[variant];
  const removeCharacterFromCollection = useLibraryStore(
    (state) => state.removeCharacterFromCollection,
  );

  return (
    <motion.article
      className={`min-w-0 overflow-hidden border border-border bg-surface ${styles.card}`}
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
        className={`relative block overflow-hidden ${styles.image}`}
        aria-label={`View ${character.name}`}
      >
        <motion.span
          className="size-full"
          layoutId={`character-avatar-${character.id}`}
          transition={{ type: "spring", stiffness: 330, damping: 32 }}
        >
          <img
            src={character.image}
            alt=""
            className="size-full object-cover transition-[filter,transform] duration-200 hover:scale-[1.025] hover:saturate-[1.05]"
            width={300}
            height={300}
            loading="lazy"
          />
        </motion.span>
        <span className="absolute top-3 left-3 bg-canvas-dark px-2 py-1 text-[0.625rem] text-content-on-dark">
          #{String(character.id).padStart(3, "0")}
        </span>
      </Link>
      <div className={styles.content}>
        <div className="flex items-center justify-between text-[0.625rem] tracking-[0.04em] text-content-muted uppercase">
          <StatusSignal status={character.status} />
          <span>{character.species}</span>
        </div>
        <h3 className="my-3 block text-[1.35rem] leading-none tracking-[-0.04em] text-content">
          <Link
            to="/characters/$characterId"
            params={{ characterId: String(character.id) }}
          >
            {character.name}
          </Link>
        </h3>
        <p className="mb-2 flex min-w-0 items-center gap-1 overflow-hidden text-[0.75rem] text-ellipsis whitespace-nowrap text-content-muted">
          <MapPin size={13} aria-hidden="true" /> {character.location.name}
        </p>
        <p className="mb-2 flex min-w-0 items-center gap-1 overflow-hidden text-[0.75rem] text-ellipsis whitespace-nowrap text-signal">
          <Radio size={13} aria-hidden="true" /> {character.episode.length}{" "}
          {character.episode.length === 1
            ? "episode appearance"
            : "episode appearances"}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <LibrarySaveButton character={character} />
          {collectionId ? (
            <button
              className="inline-flex items-center gap-1 bg-transparent p-0 text-[0.6875rem] font-semibold text-content-muted transition-[color,transform] duration-150 hover:text-alert active:scale-95"
              type="button"
              aria-label={`Remove ${character.name} from this list`}
              onClick={() =>
                removeCharacterFromCollection(collectionId, character.id)
              }
            >
              <ListMinus size={14} aria-hidden="true" /> Remove from this list
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
