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
  const addCharacterToCollection = useLibraryStore(
    (state) => state.addCharacterToCollection,
  )
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
        <Popover.Trigger className="button button--ghost collection-picker__trigger">
          <ListPlus size={17} /> Add to list
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner className="collection-picker__positioner" sideOffset={8}>
            <Popover.Popup className="collection-picker" aria-label={`Add ${character.name} to a list`}>
              <div className="collection-picker__header">
                <div>
                  <p className="eyebrow">Organize favorite</p>
                  <Popover.Title>Add to a list</Popover.Title>
                </div>
                <Popover.Close className="icon-button" aria-label="Close list picker">×</Popover.Close>
              </div>
              <p className="collection-picker__description">
                Choose an existing list, or make one for this character.
              </p>
              <div className="collection-picker__items">
                {collections.map((collection) => {
                  const selected = collection.characterIds.includes(character.id)
                  return (
                    <button
                      key={collection.id}
                      type="button"
                      className={`collection-picker__item ${selected ? 'is-selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => toggleCollection(collection.id, selected)}
                    >
                      <span>{collection.name}</span>
                      <small>{collection.characterIds.length}</small>
                      {selected ? <Check size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence initial={false} mode="wait">
                {creating ? (
                  <motion.form
                    key="create-form"
                    className="collection-picker__create"
                    onSubmit={createAndAdd}
                    initial={reducedMotion ? false : { opacity: 0, transform: 'translateY(-4px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0)' }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-3px)' }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label className="field-label" htmlFor={inputId}>New list name</label>
                    <input
                      id={inputId}
                      autoFocus
                      aria-describedby={error ? errorId : undefined}
                      aria-invalid={Boolean(error)}
                      value={name}
                      onChange={(event) => { setName(event.target.value); setError(null) }}
                      placeholder="e.g. Galactic outliers"
                      maxLength={40}
                    />
                    {error ? <p id={errorId} className="field-error" role="alert">{error}</p> : null}
                    <div className="collection-picker__create-actions">
                      <button className="button button--quiet" type="button" onClick={() => { setCreating(false); setError(null) }}>Cancel</button>
                      <button className="button" type="submit">Create and add</button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="create-button"
                    className="collection-picker__new"
                    type="button"
                    onClick={() => setCreating(true)}
                    initial={reducedMotion ? false : { opacity: 0, transform: 'translateY(-3px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0)' }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-3px)' }}
                    transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <FolderPlus size={16} /> Create new list
                  </motion.button>
                )}
              </AnimatePresence>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
    </>
  )
}
