import { Link, useLocation } from "@tanstack/react-router";
import { BookMarked, MapIcon, Radio, Search, Tv } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "./theme-toggle";

const dockIndicatorTransition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.75,
} as const;

type FloatingNavbarProps = {
  reducedMotion: boolean | null;
};
export function FloatingNavbar({ reducedMotion }: FloatingNavbarProps) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isActive = (path: string) =>
    path === "/" ? pathname === path : pathname.startsWith(path);

  return (
    <motion.nav
      className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-max items-center gap-1 rounded-[1.125rem] border border-border-strong/72 bg-surface-raised/76 p-2 shadow-2xl backdrop-blur-xl max-sm:bottom-3 max-sm:w-[calc(100%-1.5rem)] max-sm:justify-between"
      aria-label="Primary navigation"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.16 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to="/"
        className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive("/") ? "text-signal" : ""}`}
        aria-current={isActive("/") ? "page" : undefined}
      >
        {isActive("/") && (
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
        search={{ q: "", status: "all" }}
        activeOptions={{ exact: false, includeSearch: false }}
        className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive("/characters") ? "text-signal" : ""}`}
        aria-current={isActive("/characters") ? "page" : undefined}
      >
        {isActive("/characters") && (
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
        className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive("/locations") ? "text-signal" : ""}`}
        aria-current={isActive("/locations") ? "page" : undefined}
      >
        {isActive("/locations") && (
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
        className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive("/episodes") ? "text-signal" : ""}`}
        aria-current={isActive("/episodes") ? "page" : undefined}
      >
        {isActive("/episodes") && (
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
        search={{ list: "all" }}
        className={`relative inline-flex min-h-13 items-center gap-2 rounded-[0.8125rem] px-4 text-[0.8125rem] whitespace-nowrap text-content-muted transition-[color,transform] duration-150 hover:scale-[1.02] hover:text-content active:scale-95 max-sm:flex-1 max-sm:justify-center max-sm:px-2 ${isActive("/library") ? "text-signal" : ""}`}
        aria-current={isActive("/library") ? "page" : undefined}
      >
        {isActive("/library") && (
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
  );
}
