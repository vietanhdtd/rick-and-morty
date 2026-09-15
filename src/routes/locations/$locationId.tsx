import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, MapPinned, Users } from 'lucide-react'
import { getCharacters, getEntity, idFromApiUrl, queryKeys } from '@/api/rick-and-morty'
import { CharacterCard } from '@/components/character-card'
import { QueryState } from '@/components/query-state'
import { RosterReadout } from '@/components/roster-readout'

function LocationDetailPage() {
  const { locationId } = Route.useParams()
  const query = useQuery({ queryKey: queryKeys.entity('location', locationId), queryFn: () => getEntity('location', locationId) })
  const residentIds = query.data?.residents.map(idFromApiUrl).filter((id): id is number => id !== null).slice(0, 12) ?? []
  const residents = useQuery({ queryKey: ['location-residents', locationId, residentIds], queryFn: () => getCharacters(residentIds), enabled: residentIds.length > 0 })
  if (query.isPending) return <QueryState kind="loading" label="place" />
  if (query.isError || !query.data) return <QueryState kind="error" onRetry={() => query.refetch()} />
  const location = query.data
  return <section className="detail-page"><Link to="/locations" className="back-link"><ArrowLeft size={16} /> Back to places</Link><div className="location-detail-hero"><div className="location-detail-hero__glyph"><MapPinned /></div><div><p className="eyebrow">Place / #{String(location.id).padStart(3, '0')}</p><h1>{location.name}</h1><p>{location.type || 'Unknown place'} in {location.dimension}</p></div></div><div className="fact-grid"><article><span>Dimension</span><strong>{location.dimension}</strong></article><article><span>Type</span><strong>{location.type || 'Unknown'}</strong></article><article><span>Residents</span><strong>{location.residents.length}</strong></article></div><section className="related-section"><div className="section-heading"><div><p className="eyebrow"><Users size={14} /> Residents</p><h2>Characters connected to this place.</h2></div></div>{residents.isPending ? <QueryState kind="loading" label="residents" /> : residents.isError ? <QueryState kind="error" onRetry={() => residents.refetch()} /> : residents.data?.length ? <><RosterReadout records={residents.data} total={location.residents.length} noun="residents" /><div className="character-grid">{residents.data.map((character, index) => <CharacterCard key={character.id} character={character} index={index} />)}</div></> : <QueryState kind="empty" label="residents" />}</section></section>
}

export const Route = createFileRoute('/locations/$locationId')({ component: LocationDetailPage })
