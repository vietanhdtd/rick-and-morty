# Contributor guide

## Boundaries

- Keep API schemas and request functions in `src/api`; never call the Rick and Morty API directly from a page component.
- Keep server data in TanStack Query. Zustand is only for favourites, collections, and ephemeral library UI.
- Create public views in `src/routes`. Route files own param/search validation; reusable presentation belongs in `src/components`.
- Preserve the character-library invariant: deleting a collection retains favourites; removing a favourite removes all collection references.

## UI system

- Add Panda tokens in `panda.config.ts` before introducing new repeated colours or spacing values.
- Use Base UI primitives for dialogs, menus, popovers, and tooltips. Do not replace their focus/keyboard behavior with custom div controls.
- Use Motion for interactive motion. Prefer `transform` and `opacity`; never make content readability or task completion depend on animation.
- Respect `prefers-reduced-motion`. New loops, parallax, tilt, or staggered reveals require a reduced alternative.
- Preserve semantic headings, button labels, focus visibility, and colour-independent state feedback.

## Validation

Before committing, run:

```sh
bun run lint
bun run typecheck
bun test
bun run build
```

Run `bun run test:e2e` when changing route behavior or primary interactions. Do not hand-edit `src/routeTree.gen.ts` or `styled-system`; both are generated.
