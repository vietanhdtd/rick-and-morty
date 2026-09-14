import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import { getPage, queryKeys } from '@/api/rick-and-morty'
import { QueryState } from '@/components/query-state'

function LocationsPage() {
  const [page, setPage] = useState(1)
  const query = useQuery({ queryKey: queryKeys.page('location', { page }), queryFn: () => getPage('location', { page }) })
  if (query.isPending) return <QueryState kind="loading" label="location" />
  if (query.isError || !query.data) return <QueryState kind="error" onRetry={() => query.refetch()} />
  return <section className="archive-page"><header className="page-intro"><p className="eyebrow">The places index / {query.data.info.count} known</p><h1>Everywhere is <em>somewhere</em><br />to somebody.</h1><p>Planets, citadels, dream blips, and places that should probably be avoided.</p></header><div className="location-grid">{query.data.results.map((location, index) => <article className="location-card" key={location.id} style={{ '--i': index } as React.CSSProperties}><div className="location-card__glyph"><MapPin /></div><span className="eyebrow">#{String(location.id).padStart(3, '0')} / {location.type || 'Unknown'}</span><h2>{location.name}</h2><p>{location.dimension}</p><footer><span>{location.residents.length} residents</span><Link to="/locations/$locationId" params={{ locationId: String(location.id) }} aria-label={`Open ${location.name}`}><ArrowRight size={18} /></Link></footer></article>)}</div><div className="pagination"><button disabled={!query.data.info.prev} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} / {query.data.info.pages}</span><button disabled={!query.data.info.next} onClick={() => setPage((value) => value + 1)}>Next</button></div></section>
}

export const Route = createFileRoute('/locations/')({ component: LocationsPage })
