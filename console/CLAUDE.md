# Console theme

Dark terminal aesthetic, monospace font. Entry point: `index.html`.

Imports `../jaipur-game.js` for all game logic — no theme-specific JS.

## Assets

- `index.html` — all theme CSS is inline in `<style>` tags; no external stylesheet

## PWA assets

- `manifest.webmanifest` — app manifest
- `sw.js` — service worker with precache list
- `game-image.svg` — app icon

When updating cached files, bump the cache version string in `sw.js` (e.g. `jaipur-console-v1-2026-03-21`).
