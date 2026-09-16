import { Link } from "@tanstack/react-router";
import { RefreshCw, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function NotFound() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-24 text-center sm:px-8 lg:px-16">
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="flex max-w-xl flex-col items-center"
      >
        <span className="mb-6 grid size-16 place-items-center rounded-2xl bg-signal text-signal-ink">
          <Sparkles size={32} aria-hidden="true" />
        </span>
        <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          404 Error
        </p>
        <h1 className="mb-5 text-[clamp(2.5rem,5vw,4rem)] leading-none">
          Lost in the <em className="text-signal">Multiverse.</em>
        </h1>
        <p className="mb-8 text-[0.875rem] text-content-secondary">
          The page or dimension you're looking for doesn't exist. Maybe it was
          destroyed by Rick, or maybe it never existed at all.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-6 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-signal-ink transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content hover:bg-content active:scale-[0.97]"
        >
          Return to Reality
          <RefreshCw size={15} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
