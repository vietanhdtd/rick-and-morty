import { Dialog } from '@base-ui/react/dialog'
import { FolderPlus } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useLibraryStore } from '@/store/library'

export function CollectionDialog() {
  const createCollection = useLibraryStore((state) => state.createCollection)
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    createCollection(name)
    setName('')
    setOpen(false)
  }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger className="button button--ghost"><FolderPlus size={16} /> New constellation</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="dialog-backdrop" />
      <Dialog.Popup className="dialog-popup">
        <span className="eyebrow">Personal archive</span><Dialog.Title>Create a constellation</Dialog.Title>
        <Dialog.Description>Name a group for the characters you keep returning to.</Dialog.Description>
        <form onSubmit={submit}><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. C-137 regulars" maxLength={40} /><div className="dialog-actions"><Dialog.Close className="button button--quiet">Cancel</Dialog.Close><button className="button" type="submit">Create</button></div></form>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
}
