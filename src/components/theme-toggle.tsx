import { Moon, Sun } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

const THEME_KEY = "multiverse-guide-theme";
const TRANSITION_DURATION = 520;

type Theme = "light" | "dark";

type NativeViewTransition = {
  finished: Promise<void>;
  ready: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => NativeViewTransition;
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function persistTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private browsing and locked-down contexts can reject storage writes.
  }

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#11141b" : "#f8f9fc");
}

function getCircularClipPaths(x: number, y: number) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const point = `${(x / width) * 100}% ${(y / height) * 100}%`;
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  const referenceRadius = Math.hypot(width, height) / Math.SQRT2;

  return [
    `circle(0% at ${point})`,
    `circle(${(radius / referenceRadius) * 100}% at ${point})`,
  ];
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimationRef = useRef<Animation | null>(null);
  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    const viewTransitionDocument = document as ViewTransitionDocument;

    if (!button || isTransitioningRef.current) return;

    const nextTheme: Theme = isDark ? "light" : "dark";
    const applyTheme = () => {
      setTheme(nextTheme);
      persistTheme(nextTheme);
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!viewTransitionDocument.startViewTransition || prefersReducedMotion) {
      applyTheme();
      return;
    }

    const { left, top, width, height } = button.getBoundingClientRect();
    const clipPath = getCircularClipPaths(left + width / 2, top + height / 2);
    const root = document.documentElement;
    const cleanup = () => {
      activeAnimationRef.current?.cancel();
      activeAnimationRef.current = null;
      isTransitioningRef.current = false;
      delete root.dataset.themeVt;
      root.style.removeProperty("--theme-vt-duration");
      root.style.removeProperty("--theme-vt-clip-from");
    };

    isTransitioningRef.current = true;
    root.dataset.themeVt = "active";
    root.style.setProperty("--theme-vt-duration", `${TRANSITION_DURATION}ms`);
    root.style.setProperty("--theme-vt-clip-from", clipPath[0]);

    const transition = viewTransitionDocument.startViewTransition(() => {
      flushSync(applyTheme);
    });

    transition.finished.finally(cleanup).catch(() => {});
    transition.ready
      .then(() => {
        activeAnimationRef.current = document.documentElement.animate(
          { clipPath },
          {
            duration: TRANSITION_DURATION,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(cleanup);
  }, [isDark]);

  return (
    <button
      ref={buttonRef}
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
