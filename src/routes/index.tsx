import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw, Zap } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CharacterCard } from '@/components/character-card'
import { CharacterSignal, EpisodeSignal, LocationSignal } from '@/components/entity-hero'
import { QueryState } from '@/components/query-state'
import { getRandomSignal, queryKeys } from '@/api/rick-and-morty'
import { useState } from 'react'

function HomePage() {
  const [refresh, setRefresh] = useState(0)
  const reducedMotion = useReducedMotion()
  const character = useQuery({ queryKey: queryKeys.signal('character', refresh), queryFn: () => getRandomSignal('character') })
  const location = useQuery({ queryKey: queryKeys.signal('location', refresh), queryFn: () => getRandomSignal('location') })
  const episode = useQuery({ queryKey: queryKeys.signal('episode', refresh), queryFn: () => getRandomSignal('episode') })
  const suggestions = useQuery({ queryKey: ['suggestions', refresh], queryFn: () => Promise.all([getRandomSignal('character'), getRandomSignal('character'), getRandomSignal('character')]) })
  const loading = character.isPending || location.isPending || episode.isPending

  return <>
    <section className="home-hero">
      <div className="portal portal--one" aria-hidden="true" /><div className="portal portal--two" aria-hidden="true" />
      <motion.div initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
        <p className="eyebrow"><Zap size={14} /> Multiverse receiver / online</p>
        <h1>There is no<br /><em>single</em> version<br />of anything.</h1>
        <p className="home-hero__lede">A living survey of wayward people, unstable places, and transmissions from every known dimension.</p>
      </motion.div>
      <button className="button button--hero" type="button" onClick={() => setRefresh((value) => value + 1)} disabled={loading}><RefreshCw size={17} className={loading ? 'spin' : ''} /> Refresh the universe</button>
    </section>

    <section className="signal-section" aria-labelledby="signals-heading">
      <div className="section-heading"><div><p className="eyebrow">Live intake</p><h2 id="signals-heading">Three signals, <em>right now.</em></h2></div><span>{loading ? 'Decoding' : 'Updated'}</span></div>
      {loading ? <QueryState kind="loading" label="multiverse" /> : <AnimatePresence mode="wait"><motion.div key={refresh} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="signal-grid">
        {character.data ? <CharacterSignal character={character.data} /> : <QueryState kind="error" onRetry={() => character.refetch()} />}
        {location.data ? <LocationSignal location={location.data} /> : <QueryState kind="error" onRetry={() => location.refetch()} />}
        {episode.data ? <EpisodeSignal episode={episode.data} /> : <QueryState kind="error" onRetry={() => episode.refetch()} />}
      </motion.div></AnimatePresence>}
    </section>

    <section className="suggestion-section" aria-labelledby="suggestions-heading"><div className="section-heading"><div><p className="eyebrow">Unprompted encounter</p><h2 id="suggestions-heading">Try these <em>on for size.</em></h2></div></div>
      {suggestions.isPending ? <QueryState kind="loading" label="character" /> : suggestions.isError ? <QueryState kind="error" onRetry={() => suggestions.refetch()} /> : <div className="character-grid">{suggestions.data?.map((entry, index) => <CharacterCard key={`${refresh}-${entry.id}-${index}`} character={entry} index={index} />)}</div>}
    </section>
  </>
}

export const Route = createFileRoute('/')({ component: HomePage })
