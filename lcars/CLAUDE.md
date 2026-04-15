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
