import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, MapPinned, Users } from 'lucide-react'
import { getCharacters, getEntity, idFromApiUrl, queryKeys } from '@/api/rick-and-morty'
import { CharacterCard } from '@/components/character-card'
import { QueryState } from '@/components/query-state'

function LocationDetailPage() {
  const { locationId } = Route.useParams()
  const query = useQuery({ queryKey: queryKeys.entity('location', locationId), queryFn: () => getEntity('location', locationId) })
  const residentIds = query.data?.residents.map(idFromApiUrl).filter((id): id is number => id !== null).slice(0, 4) ?? []
  const residents = useQuery({ queryKey: ['location-residents', locationId, residentIds], queryFn: () => getCharacters(residentIds), enabled: residentIds.length > 0 })
  if (query.isPending) return <QueryState kind="loading" label="location dossier" />
  if (query.isError || !query.data) return <QueryState kind="error" onRetry={() => query.refetch()} />
  const location = query.data
  return <section className="detail-page"><Link to="/locations" className="back-link"><ArrowLeft size={16} /> Back to places index</Link><div className="location-detail-hero"><div className="location-detail-hero__glyph"><MapPinned /></div><div><p className="eyebrow">Location dossier / #{String(location.id).padStart(3, '0')}</p><h1>{location.name}</h1><p>{location.type || 'Unclassified location'} in {location.dimension}</p></div></div><div className="fact-grid"><article><span>Dimension</span><strong>{location.dimension}</strong></article><article><span>Classification</span><strong>{location.type || 'Unknown'}</strong></article><article><span>Recorded residents</span><strong>{location.residents.length}</strong></article></div><section className="related-section"><div className="section-heading"><div><p className="eyebrow"><Users size={14} /> Nearby signals</p><h2>Last seen <em>here.</em></h2></div></div>{residents.isPending ? <QueryState kind="loading" label="resident" /> : residents.isError ? <QueryState kind="error" onRetry={() => residents.refetch()} /> : residents.data?.length ? <div className="character-grid">{residents.data.map((character, index) => <CharacterCard key={character.id} character={character} index={index} />)}</div> : <QueryState kind="empty" label="resident" />}</section></section>
}

export const Route = createFileRoute('/locations/$locationId')({ component: LocationDetailPage })
