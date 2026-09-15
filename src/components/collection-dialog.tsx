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

  return <Dialog.Root open={open} onOpenChange={handleOpenChange}>
    <Dialog.Trigger className="button button--ghost"><FolderPlus size={16} /> {triggerLabel}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="dialog-backdrop" />
      <Dialog.Popup className="dialog-popup">
        <span className="eyebrow">Your library</span><Dialog.Title>Create a list</Dialog.Title>
        <Dialog.Description>
          {character ? `“${character.name}” will be added right away.` : 'Name a group you can return to later.'}
        </Dialog.Description>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor={inputId}>List name</label>
          <input
            id={inputId}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={Boolean(error)}
            name="list-name"
            autoComplete="off"
            value={name}
            onChange={(event) => { setName(event.target.value); setError(null) }}
            placeholder="e.g. Characters from Earth"
            maxLength={40}
            autoFocus
          />
          {error ? <p id={errorId} className="field-error" role="alert">{error}</p> : null}
          <div className="dialog-actions"><Dialog.Close className="button button--quiet">Cancel</Dialog.Close><button className="button" type="submit">Create list</button></div>
        </form>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
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

  return <Dialog.Root open={open} onOpenChange={(nextOpen) => {
    setOpen(nextOpen)
    if (nextOpen) setName(collection.name)
    if (!nextOpen) setError(null)
  }}>
    <Dialog.Trigger className="button button--quiet">Rename</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="dialog-backdrop" />
      <Dialog.Popup className="dialog-popup">
        <span className="eyebrow">List settings</span><Dialog.Title>Rename list</Dialog.Title>
        <Dialog.Description>Use a name that makes the group easy to scan later.</Dialog.Description>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor={inputId}>List name</label>
          <input
            id={inputId}
            autoFocus
            aria-describedby={error ? errorId : undefined}
            aria-invalid={Boolean(error)}
            value={name}
            onChange={(event) => { setName(event.target.value); setError(null) }}
            maxLength={40}
          />
          {error ? <p id={errorId} className="field-error" role="alert">{error}</p> : null}
          <div className="dialog-actions"><Dialog.Close className="button button--quiet">Cancel</Dialog.Close><button className="button" type="submit">Save name</button></div>
        </form>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
}
