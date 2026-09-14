import { Dialog } from '@base-ui/react/dialog'
import { createFileRoute } from '@tanstack/react-router'
import { ArchiveRestore, HeartCrack, Orbit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CharacterCard } from '@/components/character-card'
import { CollectionDialog } from '@/components/collection-dialog'
import { useLibraryStore } from '@/store/library'

function LibraryPage() {
  const savedCharacters = useLibraryStore((state) => Object.values(state.savedCharacters))
  const collections = useLibraryStore((state) => state.collections)
  const deleteCollection = useLibraryStore((state) => state.deleteCollection)
  const [selected, setSelected] = useState<string | null>(null)
  const selectedCollection = collections.find((collection) => collection.id === selected)
  const grouped = new Set(collections.flatMap((collection) => collection.characterIds))
  return <section className="library-page"><header className="page-intro"><p className="eyebrow">Personal archive / local storage synced</p><h1>Keep the weird<br /><em>close.</em></h1><p>Favourite a signal, then arrange it into constellations that make sense only to you.</p><CollectionDialog /></header><div className="library-stats"><span><ArchiveRestore size={17} /> {savedCharacters.length} saved signals</span><span><Orbit size={17} /> {collections.length} constellations</span></div>
    <section className="collection-zone"><div className="section-heading"><div><p className="eyebrow">Constellations</p><h2>Your private <em>sky map.</em></h2></div></div>{collections.length ? <div className="collection-grid">{collections.map((collection) => <article key={collection.id} className="collection-card"><span className="collection-card__count">{String(collection.characterIds.length).padStart(2, '0')}</span><h3>{collection.name}</h3><p>{collection.characterIds.length === 1 ? '1 signal' : `${collection.characterIds.length} signals`}</p><div><button type="button" onClick={() => setSelected(collection.id)}>Open</button><Dialog.Root><Dialog.Trigger className="icon-button" aria-label={`Delete ${collection.name}`}><Trash2 size={15} /></Dialog.Trigger><Dialog.Portal><Dialog.Backdrop className="dialog-backdrop" /><Dialog.Popup className="dialog-popup"><Dialog.Title>Delete “{collection.name}”?</Dialog.Title><Dialog.Description>The saved characters stay in your archive.</Dialog.Description><div className="dialog-actions"><Dialog.Close className="button button--quiet">Keep it</Dialog.Close><button className="button button--danger" type="button" onClick={() => deleteCollection(collection.id)}>Delete constellation</button></div></Dialog.Popup></Dialog.Portal></Dialog.Root></div></article>)}</div> : <div className="library-empty"><Orbit /><p>No constellations yet.</p><span>Create a group for the people you keep finding.</span></div>}</section>
    {selectedCollection && <section className="related-section"><div className="section-heading"><div><p className="eyebrow">Selected constellation</p><h2>{selectedCollection.name}</h2></div><button className="button button--quiet" type="button" onClick={() => setSelected(null)}>Close</button></div><div className="character-grid">{selectedCollection.characterIds.map((id) => useLibraryStore.getState().savedCharacters[id]).filter(Boolean).map((character, index) => <CharacterCard key={character.id} character={character} index={index} />)}</div></section>}
    <section className="related-section"><div className="section-heading"><div><p className="eyebrow">Unfiled signals</p><h2>Still <em>floating.</em></h2></div></div>{savedCharacters.filter((character) => !grouped.has(character.id)).length ? <div className="character-grid">{savedCharacters.filter((character) => !grouped.has(character.id)).map((character, index) => <CharacterCard key={character.id} character={character} index={index} />)}</div> : <div className="library-empty"><HeartCrack /><p>No loose signals.</p><span>Anything not in a constellation appears here.</span></div>}</section>
  </section>
}

export const Route = createFileRoute('/library')({ component: LibraryPage })
