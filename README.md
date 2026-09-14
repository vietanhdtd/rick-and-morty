# Living Archive

An animated, browser-persisted guide to the Rick and Morty multiverse. It is a Vite + React SPA that turns canonical character, location, and episode data into a navigable archive.

## Run locally

Prerequisites: Bun `1.2.21` (the project runtime) and Node `22+` for tool compatibility.

```sh
bun install
bun run dev
```

Other commands:

```sh
bun run typecheck
bun run lint
bun test
bun run build
bun run test:e2e
```

Install Playwright's Chromium browser before the first local E2E run:

```sh
bunx playwright install chromium
```

## Architecture

- **Vite + React** delivers a static SPA; Cloudflare Pages supplies history-route fallback in production.
- **TanStack Router** provides file-based, code-split routes and typed character-search URL state.
- **TanStack Query** owns all Rick and Morty API data, caching, pagination, request/error states, and random world signals.
- **Zustand persist** stores only user-owned favourite character snapshots and named constellations in local storage.
- **Base UI** is used for accessible dialogs and focus management; **Panda CSS** owns typed design tokens and generated styling utilities; custom CSS builds the expressive archive art direction.
- **Motion** drives entrance, layout, hover, and save interactions; **Lenis** enhances scrolling only when reduced motion is not requested.

The app uses the public [Rick and Morty API](https://rickandmortyapi.com/documentation/) over HTTPS. No API key or backend is required.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Random character, location, and episode signals; character suggestions |
| `/characters` | URL-synchronised name/status search and paginated character results |
| `/characters/$characterId` | Character facts, save action, and constellation assignment |
| `/locations` and `/locations/$locationId` | Location archive and resident suggestions |
| `/episodes` and `/episodes/$episodeId` | Episode archive and cast suggestions |
| `/library` | Saved signals, constellation creation, deletion, and grouping |

## CI/CD

GitHub Actions runs linting, type checking, Bun tests, production build, and Playwright on every pull request and `main` push. A successful `main` build uploads the verified `dist/` artifact to Cloudflare Pages using Wrangler Direct Upload.

Configure these GitHub secrets before deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Set `CLOUDFLARE_PAGES_PROJECT` as a repository variable. Keep Cloudflare Pages Git integration disconnected: the workflow owns production deployment. Protect `main` by requiring the `quality` check.

## Deliberate trade-offs and future work

This intentionally exceeds the original exercise's two-hour guidance to demonstrate routed architecture, animation, tests, and delivery automation. The trade-off is that recommendations are random API draws rather than a server-backed personalisation model.

Given more time, I would add shareable collection URLs with authentication, an offline cache, visual regression snapshots, external monitoring, and preview deployments for trusted internal pull requests.
