import { Popover } from '@base-ui/react/popover'
import { Check, FolderPlus, ListPlus, Plus } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { type FormEvent, useId, useState } from 'react'
import { useLibraryStore } from '@/store/library'
import type { Character } from '@/types/rick-and-morty'

type CollectionPickerProps = {
  character: Character
}

export function CollectionPicker({ character }: CollectionPickerProps) {
  const collections = useLibraryStore((state) => state.collections)
  const createCollection = useLibraryStore((state) => state.createCollection)
  const addCharacterToCollection = useLibraryStore((state) => state.addCharacterToCollection)
  const removeCharacterFromCollection = useLibraryStore(
    (state) => state.removeCharacterFromCollection,
  )
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const inputId = useId()
  const errorId = useId()

  function toggleCollection(collectionId: string, selected: boolean) {
    const collection = collections.find((item) => item.id === collectionId)
    if (!collection) return
    if (selected) {
      removeCharacterFromCollection(collectionId, character.id)
      setAnnouncement(`${character.name} removed from ${collection.name}.`)
      return
    }
    addCharacterToCollection(collectionId, character)
    setAnnouncement(`${character.name} added to ${collection.name}.`)
  }

  function createAndAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = createCollection(name, character)
    if (result.status === 'empty') {
      setError('Give the list a name before creating it.')
      return
    }
    if (result.status === 'duplicate') {
      setError('A list with this name already exists.')
      return
    }
    setAnnouncement(`${character.name} added to ${result.collection.name}.`)
    setName('')
    setError(null)
    setCreating(false)
  }

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-content-secondary transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content-secondary hover:bg-surface-raised active:scale-[0.97]">
          <ListPlus size={17} aria-hidden="true" /> Add to list
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            className="z-[52] max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0!"
            sideOffset={8}
          >
            <Popover.Popup
              className="w-[min(24rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] scale-100 border border-border-strong bg-surface p-4 opacity-100 shadow-lg transition-[opacity,transform] duration-150 [transform-origin:var(--transform-origin)] data-[starting-style]:scale-[.97] data-[starting-style]:opacity-0 data-[ending-style]:scale-[.97] data-[ending-style]:opacity-0 max-sm:w-full max-sm:max-w-none max-sm:border-b-0 max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:[transform-origin:bottom_center]"
              aria-label={`Add ${character.name} to a list`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
                    Organize favorite
                  </p>
                  <Popover.Title className="mt-1 text-2xl">Add to a list</Popover.Title>
                </div>
                <Popover.Close
                  className="border-0 bg-transparent p-0 text-[1.4rem] leading-none text-content-muted"
                  aria-label="Close list picker"
                >
                  ×
                </Popover.Close>
              </div>
              <p className="my-3 text-[0.75rem] text-content-muted">
                Choose an existing list, or make one for this character.
              </p>
              <div className="max-h-52 overflow-auto border-y border-border py-2">
                {collections.map((collection) => {
                  const selected = collection.characterIds.includes(character.id)
                  return (
                    <button
                      key={collection.id}
                      type="button"
                      className={`grid min-h-10 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border p-2 text-left text-[0.8125rem] ${selected ? 'border-signal bg-signal-soft text-signal' : 'border-transparent bg-transparent text-content-secondary'}`}
                      aria-pressed={selected}
                      onClick={() => toggleCollection(collection.id, selected)}
                    >
                      <span>{collection.name}</span>
                      <small className="text-[0.625rem] text-content-muted">
                        {collection.characterIds.length}
                      </small>
                      {selected ? (
                        <Check size={15} aria-hidden="true" />
                      ) : (
                        <Plus size={15} aria-hidden="true" />
                      )}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence initial={false} mode="wait">
                {creating ? (
                  <motion.form
                    key="create-form"
                    className="pt-3"
                    onSubmit={createAndAdd}
                    initial={reducedMotion ? false : { opacity: 0, transform: 'translateY(-4px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0)' }}
                    exit={
                      reducedMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-3px)' }
                    }
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label
                      className="block text-[0.625rem] tracking-[.06em] text-content-muted uppercase"
                      htmlFor={inputId}
                    >
                      New list name
                    </label>
                    <input
                      id={inputId}
                      autoFocus
                      className="my-3 min-h-11 w-full border border-border-strong bg-surface-raised p-3 text-content"
                      aria-describedby={error ? errorId : undefined}
                      aria-invalid={Boolean(error)}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        setError(null)
                      }}
                      placeholder="e.g. Galactic outliers"
                      maxLength={40}
                    />
                    {error ? (
                      <p
                        id={errorId}
                        className="-mt-2 mb-3 text-[0.75rem] font-bold text-alert"
                        role="alert"
                      >
                        {error}
                      </p>
                    ) : null}
                    <div className="flex justify-end gap-2">
                      <button
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary"
                        type="button"
                        onClick={() => {
                          setCreating(false)
                          setError(null)
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold text-signal-ink"
                        type="submit"
                      >
                        Create and add
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="create-button"
                    className="mt-3 inline-flex items-center gap-2 border-0 bg-transparent p-0 text-[0.75rem] font-semibold text-signal"
                    type="button"
                    onClick={() => setCreating(true)}
                    initial={reducedMotion ? false : { opacity: 0, transform: 'translateY(-3px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0)' }}
                    exit={
                      reducedMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-3px)' }
                    }
                    transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <FolderPlus size={16} aria-hidden="true" /> Create new list
                  </motion.button>
                )}
              </AnimatePresence>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </>
  )
}
