import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import Lenis from 'lenis'
import { Archive, BookMarked, Map as MapIcon, Radio, Search, Sparkles, Tv } from 'lucide-react'
import { useEffect } from 'react'

function RootLayout() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true })
    return () => lenis.destroy()
  }, [])

  return <div className="archive-shell">
    <div className="grain" aria-hidden="true" />
    <header className="site-header">
      <Link to="/" className="brand"><span className="brand__mark"><Sparkles size={16} /></span><span>Living<br />Archive</span></Link>
      <nav aria-label="Primary navigation">
        <Link to="/" activeProps={{ className: 'is-active' }}><Radio size={15} /> Signals</Link>
        <Link to="/characters" search={{ q: '', status: 'all' }} activeProps={{ className: 'is-active' }}><Search size={15} /> Characters</Link>
        <Link to="/locations" activeProps={{ className: 'is-active' }}><MapIcon size={15} /> Locations</Link>
        <Link to="/episodes" activeProps={{ className: 'is-active' }}><Tv size={15} /> Episodes</Link>
      </nav>
      <Link to="/library" activeProps={{ className: 'is-active' }} className="library-link"><BookMarked size={16} /><span>My library</span></Link>
    </header>
    <main><Outlet /></main>
    <footer><Archive size={14} /> A living index of a deeply unstable multiverse. Data: Rick and Morty API.</footer>
  </div>
}

export const Route = createRootRoute({ component: RootLayout })
