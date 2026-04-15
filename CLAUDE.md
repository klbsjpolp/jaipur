# CLAUDE.md

Web-based implementation of the **Jaipur** board game (2-player trading card game). Fully vanilla JavaScript — no framework, no build tool, no package manager. Codebase is in **French** (variable names, comments, UI text).

## Running the app

No build step. Serve over HTTP (required for service workers):

```bash
python3 -m http.server 8000
```

- `http://localhost:8000/console/` — retro terminal theme
- `http://localhost:8000/lcars/` — Star Trek LCARS theme

## Structure

| Path | Contents |
|------|----------|
| `jaipur-game.js` | All game logic, shared by both themes |
| `console/` | Terminal theme — see `console/CLAUDE.md` |
| `lcars/` | LCARS theme — see `lcars/CLAUDE.md` |
| `assets/` | Shared CSS and fonts (used by LCARS theme) |
| `docs/game-logic.md` | `etatJeu` state shape, key functions, French/English glossary |
