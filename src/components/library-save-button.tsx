import { Heart, Plus, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { useLibraryStore } from '@/store/library'
import type { Character } from '@/types/rick-and-morty'

const FavoriteRemovalDialog = lazy(() =>
  import('@/components/favorite-removal-dialog').then(({ FavoriteRemovalDialog }) => ({
    default: FavoriteRemovalDialog,
  })),
)

type LibrarySaveButtonProps = {
  character: Character
  variant?: 'card' | 'detail'
}

export function LibrarySaveButton({ character, variant = 'card' }: LibrarySaveButtonProps) {
  const saved = useLibraryStore((state) => Boolean(state.savedCharacters[character.id]))
  const collections = useLibraryStore((state) => state.collections)
  const saveCharacter = useLibraryStore((state) => state.saveCharacter)
  const removeCharacter = useLibraryStore((state) => state.removeCharacter)
  const reducedMotion = useReducedMotion()
  const [addVersion, setAddVersion] = useState(0)
  const [announcement, setAnnouncement] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isDetail = variant === 'detail'
  const memberships = collections.filter((collection) =>
    collection.characterIds.includes(character.id),
  )

  function handleSave() {
    if (!saved) {
      saveCharacter(character)
      setAnnouncement(`${character.name} added to favorites.`)
      setAddVersion((version) => version + 1)
      return
    }
    if (memberships.length) {
      setConfirmOpen(true)
      return
    }
    removeFromFavorites()
  }

  function removeFromFavorites() {
    const removedFrom = removeCharacter(character.id)
    setConfirmOpen(false)
    setAnnouncement(
      removedFrom
        ? `${character.name} removed from favorites and ${removedFrom} ${removedFrom === 1 ? 'list' : 'lists'}.`
        : `${character.name} removed from favorites.`,
    )
  }

  return (
    <>
      <motion.button
        className={`relative ${
          isDetail
            ? `inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] active:scale-[0.97] ${
                saved
                  ? 'border-canvas-dark bg-canvas-dark text-content-on-dark'
                  : 'border-signal bg-signal text-signal-ink hover:border-content hover:bg-content'
              }`
            : `mt-3 inline-flex items-center gap-1 bg-transparent p-0 text-[0.75rem] font-semibold transition-[color,transform] duration-150 active:scale-95 ${
                saved ? 'text-content' : 'text-signal'
              }`
        }`}
        type="button"
        onClick={handleSave}
        aria-pressed={saved}
        aria-label={
          saved ? `Remove ${character.name} from favorites` : `Add ${character.name} to favorites`
        }
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 440, damping: 22 }}
      >
        <span className="inline-grid size-[1.1rem] shrink-0 place-items-center" aria-hidden="true">
          <AnimatePresence initial={false} mode="wait">
            {saved ? (
              <motion.span
                key="saved"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.92, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotate: 12 }}
                transition={{ type: 'spring', stiffness: 520, damping: 23 }}
              >
                <Heart size={isDetail ? 17 : 16} fill="currentColor" />
              </motion.span>
            ) : (
              <motion.span
                key="unsaved"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.92, rotate: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotate: -12 }}
                transition={{ type: 'spring', stiffness: 520, damping: 23 }}
              >
                <Plus size={isDetail ? 17 : 16} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span>{saved ? 'Favorited' : isDetail ? 'Favorite' : 'Favorite'}</span>
        {!reducedMotion && saved && addVersion > 0 ? (
          <motion.span
            key={addVersion}
            className="pointer-events-none absolute -top-2.5 left-0 text-signal"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.92, y: 2 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.92, 1.06, 1.12],
              y: [2, -7, -10],
              rotate: [0, 8, 16],
            }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles size={isDetail ? 19 : 17} />
          </motion.span>
        ) : null}
      </motion.button>
      {confirmOpen ? (
        <Suspense fallback={null}>
          <FavoriteRemovalDialog
            characterName={character.name}
            membershipsCount={memberships.length}
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            onRemove={removeFromFavorites}
          />
        </Suspense>
      ) : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </>
  )
}
