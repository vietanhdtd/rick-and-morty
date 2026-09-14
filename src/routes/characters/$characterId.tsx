import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Heart, Orbit, Plus, Radio } from 'lucide-react'
import { getEntity, idFromApiUrl, queryKeys } from '@/api/rick-and-morty'
import { CollectionDialog } from '@/components/collection-dialog'
import { QueryState } from '@/components/query-state'
import { StatusSignal } from '@/components/status-signal'
import { useLibraryStore } from '@/store/library'

function CharacterDetailPage() {
  const { characterId } = Route.useParams()
  const query = useQuery({ queryKey: queryKeys.entity('character', characterId), queryFn: () => getEntity('character', characterId) })
  const saved = useLibraryStore((state) => query.data ? Boolean(state.savedCharacters[query.data.id]) : false)
  const toggle = useLibraryStore((state) => state.toggleCharacter)
  const collections = useLibraryStore((state) => state.collections)
  const toggleInCollection = useLibraryStore((state) => state.toggleInCollection)
  if (query.isPending) return <QueryState kind="loading" label="character dossier" />
  if (query.isError || !query.data) return <QueryState kind="error" onRetry={() => query.refetch()} />
  const character = query.data
  const originId = idFromApiUrl(character.origin.url)
  const locationId = idFromApiUrl(character.location.url)
  return <section className="detail-page"><Link to="/characters" search={{ q: '', status: 'all' }} className="back-link"><ArrowLeft size={16} /> Back to people index</Link><div className="detail-hero"><div className="detail-hero__portrait"><img src={character.image} alt="" /><span>#{String(character.id).padStart(3, '0')}</span></div><div><p className="eyebrow"><Radio size={14} /> Character dossier</p><StatusSignal status={character.status} /><h1>{character.name}</h1><p className="detail-hero__type">{character.type || character.species} · {character.gender}</p><button className={`button ${saved ? 'button--saved' : ''}`} type="button" onClick={() => toggle(character)}>{saved ? <Heart fill="currentColor" size={17} /> : <Plus size={17} />}{saved ? 'Saved to library' : 'Save this signal'}</button></div></div>
    <div className="fact-grid"><article><span>Origin</span>{originId ? <Link to="/locations/$locationId" params={{ locationId: String(originId) }}>{character.origin.name}</Link> : <strong>{character.origin.name}</strong>}</article><article><span>Last known location</span>{locationId ? <Link to="/locations/$locationId" params={{ locationId: String(locationId) }}>{character.location.name}</Link> : <strong>{character.location.name}</strong>}</article><article><span>Appearances</span><strong>{character.episode.length} episodes</strong></article><article><span>Species classification</span><strong>{character.species}</strong></article></div>
    {saved && <section className="collection-assignment"><div><p className="eyebrow"><Orbit size={14} /> Organize the signal</p><h2>Place in a constellation</h2></div><CollectionDialog /><div className="collection-checklist">{collections.length ? collections.map((collection) => <label key={collection.id}><input type="checkbox" checked={collection.characterIds.includes(character.id)} onChange={() => toggleInCollection(collection.id, character.id)} /> <span>{collection.name}</span></label>) : <p>Create your first constellation to begin grouping saved characters.</p>}</div></section>}
  </section>
}

export const Route = createFileRoute('/characters/$characterId')({ component: CharacterDetailPage })
