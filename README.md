# Annuality

A visual annual planning tool that displays department events on an interactive circular calendar wheel.

![Annual Plan Wheel](https://img.shields.io/badge/status-live-brightgreen)

## Features

- **Three-layer wheel** — inner month ring, event marker ring, and wedge detail panels fanning outward
- **Department color coding** — each department gets a distinct color across the wheel
- **Add/remove events** — name, date, and department via the sidebar
- **Filter by department** — click a department chip to isolate its events
- **Custom departments** — add new departments with custom colors
- **Year navigation** — browse past and future years
- **Today marker** — dashed red line showing current date position
- **Hover details** — tooltips on wheel markers, highlight effects on wedges
- **Auto-overlap resolution** — wedge panels push apart when events are close in time

## Quick start

### GitHub Pages (no install)

Visit the live version — data saves to your browser's localStorage.

### Docker

```bash
docker compose up -d --build
```

Open **http://localhost:8080** — data persists across restarts via a Docker volume.

### Local (no Docker)

```bash
node server.js
```

Open **http://localhost:3000**

## How it works

The entire frontend is a single `index.html` — no build step, no bundler, no dependencies. The wheel is rendered on an HTML Canvas with three concentric layers:

1. **Month ring** — 12 color-coded segments with rotated labels
2. **Event marker ring** — small colored arcs at each event's date position
3. **Wedge panels** — sector-shaped detail cards radiating outward, showing event name, date, and department

Persistence uses a simple Node.js server that reads/writes a JSON file to disk. When running without the server (e.g. GitHub Pages), localStorage handles everything.

## Project structure

```
├── index.html           # Entire frontend (CSS + HTML + JS)
├── server.js            # Zero-dependency Node.js server
├── Dockerfile           # node:22-alpine container
├── docker-compose.yml   # Port 8080, named volume for data
└── data/plan.json       # Auto-created, stores all plan data
```
