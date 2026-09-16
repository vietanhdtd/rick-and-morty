import { Dialog } from '@base-ui/react/dialog'
import { FolderPlus } from 'lucide-react'
import { type FormEvent, useId, useState } from 'react'
import { useLibraryStore } from '@/store/library'
import type { Character, Collection } from '@/types/rick-and-morty'

type CollectionDialogProps = {
  character?: Character
  onCreated?: (collection: Collection) => void
  triggerLabel?: string
}

export function CollectionDialog({
  character,
  onCreated,
  triggerLabel = 'New list',
}: CollectionDialogProps) {
  const createCollection = useLibraryStore((state) => state.createCollection)
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputId = useId()
  const errorId = useId()

  function submit(event: FormEvent<HTMLFormElement>) {
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
    setName('')
    setError(null)
    setOpen(false)
    onCreated?.(result.collection)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setError(null)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-content-secondary transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content-secondary hover:bg-surface-raised active:scale-[0.97]">
        <FolderPlus size={16} aria-hidden="true" /> {triggerLabel}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-canvas-dark/72 opacity-100 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[51] w-[26rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 scale-100 border border-border-strong bg-surface p-6 opacity-100 shadow-lg transition-[opacity,transform] duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
          <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            Your library
          </span>
          <Dialog.Title className="mb-3 text-3xl">Create a list</Dialog.Title>
          <Dialog.Description>
            {character
              ? `“${character.name}” will be added right away.`
              : 'Name a group you can return to later.'}
          </Dialog.Description>
          <form onSubmit={submit}>
            <label
              className="block text-[0.625rem] tracking-[.06em] text-content-muted uppercase"
              htmlFor={inputId}
            >
              List name
            </label>
            <input
              id={inputId}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={Boolean(error)}
              name="list-name"
              autoComplete="off"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError(null)
              }}
              placeholder="e.g. Characters from Earth"
              maxLength={40}
              autoFocus
              className="my-3 min-h-11 w-full border border-border-strong bg-surface-raised p-3 text-content"
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
              <Dialog.Close className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary">
                Cancel
              </Dialog.Close>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold text-signal-ink"
                type="submit"
              >
                Create list
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function RenameCollectionDialog({ collection }: { collection: Collection }) {
  const renameCollection = useLibraryStore((state) => state.renameCollection)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(collection.name)
  const [error, setError] = useState<string | null>(null)
  const inputId = useId()
  const errorId = useId()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = renameCollection(collection.id, name)
    if (result.status === 'empty') {
      setError('Give the list a name before saving it.')
      return
    }
    if (result.status === 'duplicate') {
      setError('A list with this name already exists.')
      return
    }
    setOpen(false)
    setError(null)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setName(collection.name)
        if (!nextOpen) setError(null)
      }}
    >
      <Dialog.Trigger
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary"
        aria-label={`Rename list: ${collection.name}`}
      >
        Rename
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-canvas-dark/72 opacity-100 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[51] w-[26rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 scale-100 border border-border-strong bg-surface p-6 opacity-100 shadow-lg transition-[opacity,transform] duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
          <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            List settings
          </span>
          <Dialog.Title className="mb-3 text-3xl">Rename list</Dialog.Title>
          <Dialog.Description>
            Use a name that makes the group easy to scan later.
          </Dialog.Description>
          <form onSubmit={submit}>
            <label
              className="block text-[0.625rem] tracking-[.06em] text-content-muted uppercase"
              htmlFor={inputId}
            >
              List name
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
              <Dialog.Close className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary">
                Cancel
              </Dialog.Close>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold text-signal-ink"
                type="submit"
              >
                Save name
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
