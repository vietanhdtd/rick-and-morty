import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Clapperboard, Users } from 'lucide-react'
import { getCharacters, getEntity, idFromApiUrl, queryKeys } from '@/api/rick-and-morty'
import { CharacterCard } from '@/components/character-card'
import { QueryState } from '@/components/query-state'

function EpisodeDetailPage() {
  const { episodeId } = Route.useParams()
  const query = useQuery({ queryKey: queryKeys.entity('episode', episodeId), queryFn: () => getEntity('episode', episodeId) })
  const characterIds = query.data?.characters.map(idFromApiUrl).filter((id): id is number => id !== null).slice(0, 4) ?? []
  const cast = useQuery({ queryKey: ['episode-cast', episodeId, characterIds], queryFn: () => getCharacters(characterIds), enabled: characterIds.length > 0 })
  if (query.isPending) return <QueryState kind="loading" label="episode dossier" />
  if (query.isError || !query.data) return <QueryState kind="error" onRetry={() => query.refetch()} />
  const episode = query.data
  return <section className="detail-page"><Link to="/episodes" className="back-link"><ArrowLeft size={16} /> Back to transmission log</Link><div className="episode-detail-hero"><div className="episode-detail-hero__glyph"><Clapperboard /></div><div><p className="eyebrow">Episode dossier / {episode.episode}</p><h1>{episode.name}</h1><p>Aired {episode.air_date}</p></div></div><div className="fact-grid"><article><span>Transmission code</span><strong>{episode.episode}</strong></article><article><span>Air date</span><strong>{episode.air_date}</strong></article><article><span>Recorded cast</span><strong>{episode.characters.length} characters</strong></article></div><section className="related-section"><div className="section-heading"><div><p className="eyebrow"><Users size={14} /> Cast sample</p><h2>People who <em>made it through.</em></h2></div></div>{cast.isPending ? <QueryState kind="loading" label="character" /> : cast.isError ? <QueryState kind="error" onRetry={() => cast.refetch()} /> : cast.data?.length ? <div className="character-grid">{cast.data.map((character, index) => <CharacterCard key={character.id} character={character} index={index} />)}</div> : <QueryState kind="empty" label="character" />}</section></section>
}

export const Route = createFileRoute('/episodes/$episodeId')({ component: EpisodeDetailPage })
