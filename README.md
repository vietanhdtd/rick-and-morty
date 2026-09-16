# Multiverse Guide

**Live Demo:** [https://rick-n-morty.vietanh-phurieng.workers.dev](https://rick-n-morty.vietanh-phurieng.workers.dev)

Multiverse Guide is a responsive front-end showcase for exploring the Rick and Morty universe. It reads canonical character, location, and episode data from the public [Rick and Morty API](https://rickandmortyapi.com/documentation/), lets visitors search and save characters, and organize them into personal lists that persist in their browser.

## Exercise requirement coverage

| Requirement | Delivery |
| --- | --- |
| Website and framework | A Vite + React single-page application with eight navigable views: home, character index and detail, location index and detail, episode index and detail, and saved library. The layout adapts from desktop down to mobile. |
| API usage | TanStack Query reads characters, locations, and episodes over HTTPS from the Rick and Morty API. No API key or backend is required. |
| Search | The character index has debounced name search, an alive/dead/unknown filter, URL-synchronised search state, and paginated results. |
| Favourites and groups | A character can be saved or removed from any character card. Saved characters can be assigned to or removed from named lists; both lists and favourites can be deleted. |
| Storage | Zustand persistence stores saved-character snapshots and lists in `localStorage`, so they are restored on the next visit. Removing a favourite also removes its list references; deleting a list retains its saved characters. |
| Hosting and code | The application is currently deployed via Cloudflare Workers at [rick-n-morty.vietanh-phurieng.workers.dev](https://rick-n-morty.vietanh-phurieng.workers.dev). The repository includes a GitHub Actions quality-and-deploy workflow for continuous deployment. |

## Run locally

Prerequisites:

- Bun `1.4.2` or later (the pinned project package manager)
- Node.js `22` or later for tool compatibility

```sh
bun install
bun run dev
```

Open the URL shown by Vite (normally `http://localhost:5173`).

### VS Code

Install the recommended **Biome** extension when VS Code prompts you. The workspace settings use Biome as the formatter for JavaScript, TypeScript, JSON, and CSS, then format, apply safe fixes, and organize imports whenever you save.

### Validation commands

```sh
bun run lint
bun run typecheck
bun test
bun run build
```

## Architecture, Frameworks, and Trade-offs

### Architectural Decisions and Frameworks
- **Vite + React** keeps the application small and fast to start, while **TanStack Router** supplies typed, file-based routes and URL-backed character search state.
- **TanStack Query** owns remote API state: requests, caching, pagination, loading, empty, and error states. API schemas and request functions live in `src/api`, keeping page components focused on presentation.
- **Zustand with `persist`** owns only user-controlled local state: favourite character snapshots and named lists. This cleanly separates browser-owned state from API data.
- Reusable visual components live in `src/components`; route files own route parameters and search validation. A dedicated **`tokens.css`** token system provides semantic design variables and light/dark theme values, **Base UI** supplies accessible dialogs and focus management, and **Motion** handles non-essential interface motion with reduced-motion alternatives.
- The visual direction is a light, technical guide rather than a direct reproduction of the source material. It uses semantic controls, visible focus states, text-backed status indicators, responsive layouts, and restrained motion.

### Trade-offs made due to the 2-hour time limit
Due to the strict time constraint, several deliberate trade-offs were made. Given more time, I would address these through the following features and refactors:

- **E2E Testing vs Unit Testing**: While core store logic and some components are unit tested with Bun, setting up Playwright or Cypress for End-to-End user flow validation (like saving to the library and filtering) was skipped to focus on feature completeness.
- **LocalStorage limitations**: Currently, full character objects are persisted to `localStorage` via Zustand to instantly render the library. For a production app with thousands of favorites, this risks hitting the 5MB storage limit. Given more time, I would refactor to store only IDs locally (or use IndexedDB) and rely on TanStack Query to hydrate the character data.
- **API Scope**: The official Rick and Morty API lacks deeper media context. I would love to connect the free TVmaze API (specifically the `api.tvmaze.com/shows/216/episodes` and `/cast` endpoints) to augment the UI with episode synopses, runtime details, real-world voice actor credits, and episode stills, creating a richer lore experience.

## Accessibility

The application is built with accessibility as a core consideration:

- **Semantic & structural HTML**: Strict single-landmark hierarchy (`<main>`, `<nav>`, `<header>`, `<aside>`, `<section>`, `<article>`), correctly structured headings (`<h1>` through `<h3>`), and semantic controls throughout.
- **Keyboard navigation & focus management**: Skip-to-content link moving programmatic focus to `#main-content`, visible 2px focus indicators (`:focus-visible`) with 3px offset, accessible dialogs with focus trapping and Escape-to-close (via Base UI).
- **ARIA & accessible labelling**: Navigation links indicate active page state with `aria-current="page"`; filter buttons indicate selection state with `aria-pressed`; expand/collapse controls expose `aria-expanded` and `aria-controls`; interactive icon buttons and link targets include descriptive `aria-label`s; decorative icons are hidden from assistive tech with `aria-hidden="true"`.
- **Live regions & feedback**: Dynamic updates (search result counts, loading states, error alerts, and favorite/list actions) use polite live regions (`aria-live="polite"`, `role="status"`, `role="alert"`).
- **Colour independence & contrast**: Status signals pair color with explicit text labels (`Alive`, `Dead`, `unknown`); contrast ratios comply with WCAG AA in both light and dark themes.
- **Reduced motion**: Respects `prefers-reduced-motion` across Framer Motion transitions, CSS keyframes, and Lenis smooth scrolling.

## Quality and deployment

The GitHub Actions workflow runs Biome linting, type checking, Bun unit tests, and a production build on pull requests and pushes to `main`. On a successful `main` build, it deploys the verified `dist/` artifact through a Cloudflare Worker with Static Assets.

Before enabling deployment, configure these GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Create the `living-archive` Worker in the Cloudflare dashboard (or let the first deployment create it), keep Cloudflare's Git integration disconnected, and protect `main` with the `quality` check. The Worker serves the Vite build from `dist/` and returns `index.html` for client-side routes.
