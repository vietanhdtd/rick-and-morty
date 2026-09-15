# Multiverse Guide design system

## Intent

Multiverse Guide is a polished front-end showcase built on the Rick and Morty API. It helps people find a character, follow their appearances, save favourites, and collect them into personal lists. The flow is **discover → save → group → revisit**.

The visual character is an engineered light field: calm, technical, and information-first, with a small dose of playful motion at meaningful moments. It is not a terminal, archive, dossier, transmission system, or constellation map.

## Foundations

| Token | Use |
| --- | --- |
| Paper | cool near-white page surface |
| Graphite | the one dark information band and high-contrast surfaces |
| Cobalt | active navigation, focus, primary actions, and selected states |
| Green / coral / amber | character status and destructive feedback only |

Use `JetBrains Mono` across display hierarchy, reading, controls, IDs, filters, counts, and compact metadata. Keep the 4px spacing rhythm. Controls use 6px radii; content surfaces use 10px radii. Borders establish structure; shadows are quiet and rare. The system has a light and dark Cobalt mode; a button-origin circular view transition reveals a deliberate user-selected change.

## Layout

- Home is a workbench: an explanatory left column and a live discovery panel, followed by a smaller character shelf.
- Index pages are search- or list-first. A concise header supports the task; it never acts as a marketing hero.
- Detail pages lead with an identity block, factual fields, then linked places or episode appearances.
- Library is a saved-items workspace: lists first, then saved characters not yet assigned.
- Desktop uses a 1200px content frame; tablet uses two tracks; mobile uses one track, 16px gutters, and 44px minimum touch targets.

## Content voice

Use direct labels: **Characters**, **Places**, **Episodes**, **Saved**, and **Lists**. Describe data plainly: “episode appearances”, “residents”, “search results”, and “saved characters”. Avoid invented claims, lore-heavy metaphors, and decorative section labels.

## Motion

Motion has a job and respects reduced-motion preferences.

| Interaction | Default | Reduced motion |
| --- | --- | --- |
| Route change | 220ms fade and 10px rise | 120ms fade |
| Character card to detail | shared portrait spring | static continuity |
| Save / unsave | 160–220ms icon morph and text response | instant state change |
| Refresh discovery | 220ms opacity replacement | 120ms opacity replacement |
| Dialog | 180ms opacity and small scale | opacity only |

Do not animate typing, filtering, keyboard-driven actions, or core navigation. Hover motion is only available on fine-pointer devices. Animate transforms and opacity only.

## Accessibility and failure handling

- Every icon-only action has an accessible name; semantic status has text as well as colour.
- Focus rings use cobalt with a visible offset.
- Dialogs return focus to their trigger and close with Escape.
- API not-found results explain that no matches were found; other failures offer a retry.
- Stored favourites and lists are enhancements: browsing stays available without persistence.
