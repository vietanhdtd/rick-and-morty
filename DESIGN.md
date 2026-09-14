# Living Archive design system

## Intent

Living Archive is not a catalogue. It is a slightly unstable transmission room that gives a newcomer a way into the Rick and Morty universe through real canonical data. The emotional sequence is **encounter → context → curiosity → keep**.

The memorable image is a black archival terminal punctured by an acidic, spinning portal. The visual language is editorial and technical rather than a direct recreation of the show.

## Foundations

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#090c0b` | dominant field and page background |
| Panel | `#171e1b` | cards, forms, floating context |
| Bone | `#f0ede2` | primary copy |
| Muted | `#9ca69c` | metadata and secondary copy |
| Portal | `#bdff3f` | active states, calls to action, live signal |
| Ultraviolet | `#9c8bff` | unknown status and saved state |
| Signal | `#ff8066` | destructive action and dead status |

`Syne` is the display face: tight, heavy, and slightly unruly. `DM Mono` makes labels feel like recovered technical records. Never substitute a generic UI sans for either role.

Spacing uses a 4px rhythm. Borders are single-pixel, low-opacity bone; shadows are reserved for dialogs. Image treatment is cool, desaturated portraiture which regains saturation on deliberate hover.

## Layout

- Desktop: centered 1440px canvas with 4vw page gutters. The home signal grid is asymmetric: character receives the visual lead, then location and episode form a paired secondary field.
- Tablet: two-column signals and card grids; metadata facts shift to two columns.
- Mobile: 16px gutters, one-column cards, 68px header, horizontal filter rail, stacked details. Touch actions remain at least 44px in their interactive area.
- The fixed grain layer is visual-only and never intercepts pointer input.

## Components and states

- **Portal hero**: archive status, display headline, single refresh action, two decorative portal rings.
- **Signal cards**: every signal has source label, factual API field, and an explicit routed action. Character cards also expose save state.
- **Character card**: portrait, status dot, species, last location, save button. Card click opens the routed dossier; save is a distinct native button.
- **Query state**: loading uses an orbital loader; error states offer reconnect; empty states explain the outcome and give a next action.
- **Dossier**: uses one large identity block followed by facts. API relationships become links only when an API resource id exists.
- **Constellation**: a user-named group with count, open action, and an accessible Base UI delete confirmation.

## Motion specification

| Interaction | Motion | Default | Reduced motion |
| --- | --- | --- | --- |
| Home entry | heading moves 25px upward and fades in | 750ms, `0.16 1 0.3 1` | opacity only |
| Portal rings | slow rotation / orbital drift | 10–26s, infinite | no loop |
| Signal refresh | outgoing fade, replacement card layout transition | 220–440ms | 120ms fade |
| Card entry | capped 45ms stagger, 20px rise | 440ms | opacity only, no stagger |
| Card hover | 7px upward lift and image scale | 200–600ms | none |
| Save | instant colour/state response | spring-like Motion transition | instant |
| Dialog | backdrop fade, centered panel | 180ms | fade only |

All essential content is present before or without its animation. Motion is limited to compositor-friendly opacity and transforms. Lenis is not initialized when `prefers-reduced-motion` is enabled.

## Accessibility and failure handling

- All icon actions include labels; status includes text as well as colour.
- Base UI dialogs trap focus and return it to the trigger. Escape closes dialogs.
- Focus indicators use portal green with a visible offset.
- API 404 search responses become empty states, not generic failures. Other failures retain a reconnect control.
- Browser storage is an enhancement: API exploration remains available if persistence is unavailable.
