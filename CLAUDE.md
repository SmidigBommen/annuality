# Annual Plan — Wheel View

A visual annual planning tool that displays department events on an interactive circular calendar.

## Architecture

Single-page app with zero frontend dependencies. Pure HTML Canvas + vanilla JS.

- `index.html` — Entire frontend: CSS, HTML, and JS in one file. Canvas-based wheel renderer with three visual layers (month ring, event marker ring, wedge detail panels).
- `server.js` — Zero-dependency Node.js server. Serves `index.html` at `/` and provides `GET/POST /api/plan` for JSON persistence to disk.
- Data stored in `data/plan.json`. Frontend also uses localStorage as instant fallback.

## Running

```
docker compose up -d --build
# → http://localhost:8080
```

Or without Docker:

```
node server.js
# → http://localhost:3000
```

## Key design decisions

- **Canvas, not SVG/DOM** — The wheel, arcs, wedges, and text are all drawn on a single `<canvas>`. This avoids DOM complexity and gives full control over the circular layout.
- **Three-layer wheel**: inner month ring → thin event marker ring → outer wedge detail panels that fan outward with event name, date, and department.
- **Wedge overlap resolution** — Events close in time have their wedge panels pushed apart iteratively so they never overlap. A thin connector line links each wedge back to its true date position on the marker ring.
- **Debounced persistence** — `saveState()` writes to localStorage immediately and debounces a `POST /api/plan` by 300ms to avoid hammering the server on rapid edits.
- **No build step, no bundler, no dependencies** — The entire app is `index.html` + `server.js`.

## State shape

```json
{
  "departments": [{ "id": "d1", "name": "Engineering", "color": "#6c5ce7" }],
  "events": [{ "id": "e1", "name": "Q1 Planning", "date": "2026-01-15", "deptId": "d1" }]
}
```

## Modifying the wheel rendering

All drawing happens in the `draw()` function inside `index.html`. Key radii are computed in `resize()`:

- `monthInR` / `monthOutR` — inner month ring bounds
- `evtInR` / `evtOutR` — event marker ring bounds
- `wedgeInR` / `wedgeDepth` — wedge detail panel bounds

Angles: January 1 starts at 12 o'clock (−π/2). `dateToAngle()` converts any date string to its position on the wheel.
