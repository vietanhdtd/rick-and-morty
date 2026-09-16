import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Archive } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { FloatingNavbar } from "@/components/floating-navbar";
import { NotFound } from "@/components/not-found";

function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let disposed = false;
    let lenis: { destroy: () => void } | undefined;
    let cancelScheduledWork: (() => void) | undefined;

    const initializeLenis = () => {
      void import("lenis")
        .then(({ default: Lenis }) => {
          if (!disposed) {
            lenis = new Lenis({
              autoRaf: true,
              lerp: 0.085,
              smoothWheel: true,
            });
          }
        })
        .catch(() => {
          // Smooth scrolling is optional; native scrolling remains available.
        });
    };

    if ("requestIdleCallback" in window) {
      const idleCallbackId = window.requestIdleCallback(initializeLenis, {
        timeout: 1_000,
      });
      cancelScheduledWork = () => window.cancelIdleCallback(idleCallbackId);
    } else {
      const timeoutId = setTimeout(initializeLenis, 0);
      cancelScheduledWork = () => clearTimeout(timeoutId);
    }

    return () => {
      disposed = true;
      cancelScheduledWork?.();
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="min-h-dvh pb-24">
      <a
        className="fixed top-0 left-4 z-100 translate-y-[-120%] bg-canvas-dark px-3 py-2 text-sm text-content-on-dark transition-transform duration-150 focus-visible:translate-y-3"
        href="#main-content"
      >
        Skip to content
      </a>
      <FloatingNavbar reducedMotion={reducedMotion} />
      <LayoutGroup id="archive-route-layout">
        <main
          className="mx-auto min-w-0 max-w-6xl"
          id="main-content"
          tabIndex={-1}
        >
          <motion.div
            key={pathname}
            className="min-w-0"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.12 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Outlet />
          </motion.div>
        </main>
      </LayoutGroup>
      <footer className="mt-16 flex gap-2 border-t border-border px-4 py-8 text-[0.6875rem] text-content-muted sm:px-8 lg:px-12">
        <Archive className="shrink-0" size={14} aria-hidden="true" />
        <p>
          Explore the characters, places, and episodes of Rick and Morty. Data
          provided by{" "}
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
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
