import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { Archive, BookMarked, Map as MapIcon, Radio, Search, Tv } from 'lucide-react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { NotFound } from '@/components/not-found'
import { ThemeToggle } from '@/components/theme-toggle'

const dockIndicatorTransition = {
  type: 'spring',
  stiffness: 520,
  damping: 38,
  mass: 0.75,
} as const

function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const reducedMotion = useReducedMotion()
  const isActive = (path: string) => (path === '/' ? pathname === path : pathname.startsWith(path))

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let disposed = false
    let lenis: { destroy: () => void } | undefined
    let cancelScheduledWork: (() => void) | undefined

    const initializeLenis = () => {
      void import('lenis')
        .then(({ default: Lenis }) => {
          if (!disposed) {
            lenis = new Lenis({
              autoRaf: true,
              lerp: 0.085,
              smoothWheel: true,
            })
          }
        })
        .catch(() => {
          // Smooth scrolling is optional; native scrolling remains available.
        })
    }

    if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(initializeLenis, {
        timeout: 1_000,
      })
      cancelScheduledWork = () => window.cancelIdleCallback(idleCallbackId)
    } else {
      const timeoutId = setTimeout(initializeLenis, 0)
      cancelScheduledWork = () => clearTimeout(timeoutId)
    }

    return () => {
      disposed = true
      cancelScheduledWork?.()
      lenis?.destroy()
    }
  }, [])

  return (
    <div className="min-h-dvh pb-24">
      <a
        className="fixed top-0 left-4 z-[100] -translate-y-[120%] bg-canvas-dark px-3 py-2 text-sm text-content-on-dark transition-transform duration-150 focus-visible:translate-y-3"
        href="#main-content"
      >
        Skip to content
      </a>
      <motion.nav
        className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-max items-center gap-1 rounded-[1.125rem] border border-border-strong/72 bg-surface-raised/76 p-2 shadow-2xl backdrop-blur-xl max-sm:bottom-3 max-sm:w-[calc(100%-1.5rem)] max-sm:justify-between"
        aria-label="Primary navigation"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.16 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          to="/"
          className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive('/') ? 'text-content' : ''}`}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          {isActive('/') && (
            <motion.span
              className="absolute inset-0 -z-10 rounded-[inherit] border border-signal/38 bg-signal-soft/84"
              layoutId="dock-nav-active"
              transition={dockIndicatorTransition}
            />
          )}
          <Radio size={16} aria-hidden="true" />
          <span className="max-sm:sr-only">Discover</span>
        </Link>
        <Link
          to="/characters"
          search={{ q: '', status: 'all' }}
          activeOptions={{ exact: false, includeSearch: false }}
          className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive('/characters') ? 'text-signal' : ''}`}
          aria-current={isActive('/characters') ? 'page' : undefined}
        >
          {isActive('/characters') && (
            <motion.span
              className="absolute inset-0 -z-10 rounded-[inherit] border border-signal/38 bg-signal-soft/84"
              layoutId="dock-nav-active"
              transition={dockIndicatorTransition}
            />
          )}
          <Search size={16} aria-hidden="true" />
          <span className="max-sm:sr-only">Characters</span>
        </Link>
        <Link
          to="/locations"
          className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive('/locations') ? 'text-signal' : ''}`}
          aria-current={isActive('/locations') ? 'page' : undefined}
        >
          {isActive('/locations') && (
            <motion.span
              className="absolute inset-0 -z-10 rounded-[inherit] border border-signal/38 bg-signal-soft/84"
              layoutId="dock-nav-active"
              transition={dockIndicatorTransition}
            />
          )}
          <MapIcon size={16} aria-hidden="true" />
          <span className="max-sm:sr-only">Locations</span>
        </Link>
        <Link
          to="/episodes"
          className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive('/episodes') ? 'text-signal' : ''}`}
          aria-current={isActive('/episodes') ? 'page' : undefined}
        >
          {isActive('/episodes') && (
            <motion.span
              className="absolute inset-0 -z-10 rounded-[inherit] border border-signal/38 bg-signal-soft/84"
              layoutId="dock-nav-active"
              transition={dockIndicatorTransition}
            />
          )}
          <Tv size={16} aria-hidden="true" />
          <span className="max-sm:sr-only">Episodes</span>
        </Link>
        <Link
          to="/library"
          search={{ list: 'all' }}
          className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive('/library') ? 'text-signal' : ''}`}
          aria-current={isActive('/library') ? 'page' : undefined}
        >
          {isActive('/library') && (
            <motion.span
              className="absolute inset-0 -z-10 rounded-[inherit] border border-signal/38 bg-signal-soft/84"
              layoutId="dock-nav-active"
              transition={dockIndicatorTransition}
            />
          )}
          <BookMarked size={16} aria-hidden="true" />
          <span className="max-sm:sr-only">Saved</span>
        </Link>
        <ThemeToggle />
      </motion.nav>
      <LayoutGroup id="archive-route-layout">
        <main className="mx-auto min-w-0 max-w-6xl" id="main-content" tabIndex={-1}>
          <motion.div
            key={pathname}
            className="min-w-0"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </LayoutGroup>
      <footer className="mt-16 flex gap-2 border-t border-border px-4 py-8 text-[0.6875rem] text-content-muted sm:px-8 lg:px-12">
        <Archive className="shrink-0" size={14} aria-hidden="true" />
        <p>
          Explore the characters, places, and episodes of Rick and Morty. Data provided by{" "}
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-content transition-colors hover:text-signal hover:underline"
          >
            The Rick and Morty API
          </a>
          .
        </p>
      </footer>
    </div>
  )
}

export const Route = createRootRoute({ 
  component: RootLayout,
  notFoundComponent: NotFound 
})
