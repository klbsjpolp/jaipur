# LCARS theme

Star Trek TNG-inspired layout. Entry point: `index.html`.

Imports `../jaipur-game.js` for all game logic — no theme-specific JS.

## Shared assets

- `../assets/classic.css` — LCARS-specific stylesheet
- `../assets/` — Antonio font files (Bold + Regular, woff/woff2)
- `../assets/lcars.js` — LCARS UI helpers

## PWA assets

- `manifest.webmanifest` — app manifest
- `sw.js` — service worker with precache list
- `game-image.svg` — app icon

When updating cached files, bump the cache version string in `sw.js` (e.g. `jaipur-lcars-v1-2026-03-21`).

## Layout notes

- CSS subgrid (`grid-template-rows: subgrid`) aligns left-frame labels with right-frame content in `.wrap.small`
- `.right-frame:before/:after` corner decorations sit at `top: var(--bar-height)` — player content must start below them via `.player-bar-spacer`
- `classic-standard.html` at the project root is a component showcase for `classic.css` UI elements

## Gotchas

- **Linter**: A linter runs on `index.html` and silently rewrites CSS values — don't fight its changes
- **iOS Safari animations**: CSS animations triggered by adding a class don't reliably start; set `element.style.animation` directly as an inline style instead
