# Multiverse Guide

Multiverse Guide is a responsive front-end showcase for exploring the Rick and Morty universe. It reads canonical character, location, and episode data from the public [Rick and Morty API](https://rickandmortyapi.com/documentation/), lets visitors search and save characters, and organize them into personal lists that persist in their browser.

## Exercise requirement coverage

| Requirement | Delivery |
| --- | --- |
| Website and framework | A Vite + React single-page application with eight navigable views: home, character index and detail, location index and detail, episode index and detail, and saved library. The layout adapts from desktop down to mobile. |
| API usage | TanStack Query reads characters, locations, and episodes over HTTPS from the Rick and Morty API. No API key or backend is required. |
| Search | The character index has debounced name search, an alive/dead/unknown filter, URL-synchronised search state, and paginated results. |
| Favourites and groups | A character can be saved or removed from any character card. Saved characters can be assigned to or removed from named lists; both lists and favourites can be deleted. |
| Storage | Zustand persistence stores saved-character snapshots and lists in `localStorage`, so they are restored on the next visit. Removing a favourite also removes its list references; deleting a list retains its saved characters. |
| Hosting and code | The repository includes a GitHub Actions quality-and-deploy workflow for Cloudflare Pages. Configure the deployment values below before pushing `main`. |

## Run locally

Prerequisites:

- Bun `1.2.21` or later (the pinned project package manager)
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

## Architecture and decisions

- **Vite + React** keeps the application small and fast to start, while **TanStack Router** supplies typed, file-based routes and URL-backed character search state.
- **TanStack Query** owns remote API state: requests, caching, pagination, loading, empty, and error states. API schemas and request functions live in `src/api`, keeping page components focused on presentation.
- **Zustand with `persist`** owns only user-controlled local state: favourite character snapshots and named lists. This cleanly separates browser-owned state from API data.
- Reusable visual components live in `src/components`; route files own route parameters and search validation. **Panda CSS** provides typed design tokens, **Base UI** supplies accessible dialogs and focus management, and **Motion** handles non-essential interface motion with reduced-motion alternatives.
- The visual direction is a light, technical guide rather than a direct reproduction of the source material. It uses semantic controls, visible focus states, text-backed status indicators, responsive layouts, and restrained motion.

## Two-hour scope and trade-offs

The core flow was prioritised over a backend: discover canonical data, search characters, save favourites, group them, return later, and remove either favourites or groups safely. Characters are the saveable entity; locations and episodes provide richer browsing and routed context without multiplying the persistence model.

Persistence is intentionally browser-local rather than account-based. Home-page recommendations are random API draws instead of personalised recommendations, and the application does not require an API proxy or secret. These choices keep the exercise deployable as a static site while preserving a clear state boundary.

## Quality and deployment

The GitHub Actions workflow runs Biome linting, type checking, Bun unit tests, and a production build on pull requests and pushes to `main`. On a successful `main` build, it deploys the verified `dist/` artifact to Cloudflare Pages.

Before enabling deployment, configure these GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Also set `CLOUDFLARE_PAGES_PROJECT` as a repository variable, keep Cloudflare Pages Git integration disconnected, and protect `main` with the `quality` check.
