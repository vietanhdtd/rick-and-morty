import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Clapperboard, Radio } from 'lucide-react'
import { useState } from 'react'
import { getPage, queryKeys } from '@/api/rick-and-morty'
import { QueryState } from '@/components/query-state'

function EpisodesPage() {
  const [page, setPage] = useState(1)
  const query = useQuery({ queryKey: queryKeys.page('episode', { page }), queryFn: () => getPage('episode', { page }) })
  if (query.isPending) return <QueryState kind="loading" label="episode" />
  if (query.isError || !query.data) return <QueryState kind="error" onRetry={() => query.refetch()} />
  return <section className="archive-page"><header className="page-intro"><p className="eyebrow">Transmission log / {query.data.info.count} recordings</p><h1>The story keeps<br /><em>splitting.</em></h1><p>Episode records from the moments reality became a little less negotiable.</p></header><div className="episode-list">{query.data.results.map((episode) => <article className="episode-row" key={episode.id}><div className="episode-row__code"><Clapperboard size={18} /><span>{episode.episode}</span></div><div><h2>{episode.name}</h2><p>Air date: {episode.air_date}</p></div><div className="episode-row__cast"><Radio size={14} /> {episode.characters.length} character signals</div><Link to="/episodes/$episodeId" params={{ episodeId: String(episode.id) }} aria-label={`Open ${episode.name}`}><ArrowRight size={20} /></Link></article>)}</div><div className="pagination"><button disabled={!query.data.info.prev} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} / {query.data.info.pages}</span><button disabled={!query.data.info.next} onClick={() => setPage((value) => value + 1)}>Next</button></div></section>
}

export const Route = createFileRoute('/episodes/')({ component: EpisodesPage })
