import { Link, Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import Lenis from "lenis";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  Archive,
  BookMarked,
  Map as MapIcon,
  Radio,
  Search,
  Tv,
} from "lucide-react";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const dockIndicatorTransition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.75,
} as const;

function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const reducedMotion = useReducedMotion();
  const isActive = (path: string) =>
    path === "/" ? pathname === path : pathname.startsWith(path);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true });
    return () => lenis.destroy();
  }, []);

  return (
    <div className="archive-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <motion.nav
        className="dock-nav"
        aria-label="Primary navigation"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.16 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className={`dock-nav__link${isActive("/") ? " is-active" : ""}`}>
          {isActive("/") && <motion.span className="dock-nav__active" layoutId="dock-nav-active" transition={dockIndicatorTransition} />}
          <Radio size={16} aria-hidden="true" />
          <span className="dock-nav__label">Discover</span>
        </Link>
        <Link
          to="/characters"
          search={{ q: "", status: "all" }}
          activeOptions={{ exact: false, includeSearch: false }}
          className={`dock-nav__link${isActive("/characters") ? " is-active" : ""}`}
        >
          {isActive("/characters") && <motion.span className="dock-nav__active" layoutId="dock-nav-active" transition={dockIndicatorTransition} />}
          <Search size={16} aria-hidden="true" />
          <span className="dock-nav__label">Characters</span>
        </Link>
        <Link to="/locations" className={`dock-nav__link${isActive("/locations") ? " is-active" : ""}`}>
          {isActive("/locations") && <motion.span className="dock-nav__active" layoutId="dock-nav-active" transition={dockIndicatorTransition} />}
          <MapIcon size={16} aria-hidden="true" />
          <span className="dock-nav__label">Locations</span>
        </Link>
        <Link to="/episodes" className={`dock-nav__link${isActive("/episodes") ? " is-active" : ""}`}>
          {isActive("/episodes") && <motion.span className="dock-nav__active" layoutId="dock-nav-active" transition={dockIndicatorTransition} />}
          <Tv size={16} aria-hidden="true" />
          <span className="dock-nav__label">Episodes</span>
        </Link>
        <Link to="/library" search={{ list: "all" }} className={`dock-nav__link${isActive("/library") ? " is-active" : ""}`}>
          {isActive("/library") && <motion.span className="dock-nav__active" layoutId="dock-nav-active" transition={dockIndicatorTransition} />}
          <BookMarked size={16} aria-hidden="true" />
          <span className="dock-nav__label">Saved</span>
        </Link>
        <ThemeToggle />
      </motion.nav>
      <LayoutGroup id="archive-route-layout">
        <main id="main-content">
          <motion.div
            key={pathname}
            className="route-transition"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </LayoutGroup>
      <footer>
        <Archive size={14} /> Explore the characters, places, and episodes of
        Rick and Morty. Data: Rick and Morty API.
      </footer>
    </div>
  );
}

export const Route = createRootRoute({ component: RootLayout });
