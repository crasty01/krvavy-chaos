# Krvavý Chaos

A Twitch **Video Overlay** extension for the Czech Blood on the Clocktower (BotC) community stream *"Krvavá hodina odbila"*.

The extension shows live game info (players, characters, roles, game phase) overlaid on the stream video, with hoverable elements revealing additional details to viewers. Multiple streamers playing the same game can have their channels linked to share a single game state, which is updated in real time by authorized editors.

---

## Monorepo Structure

```
krvavy-chaos/
├── packages/
│   ├── extension/   — Vite + Svelte 5 static overlay (uploaded to Twitch CDN)
│   ├── web/         — SvelteKit editor app + REST API (deployed to Vercel)
│   └── shared/      — Shared TypeScript types used by both packages
├── pnpm-workspace.yaml
└── package.json
```

---

## Setup

```bash
# Install dependencies
pnpm install

# Start dev servers
pnpm dev:extension   # Vite dev server for the overlay
pnpm dev:web         # SvelteKit dev server for the editor app

# Build
pnpm build:extension # Builds and zips the overlay to dist/app.zip
pnpm build:web       # Builds the SvelteKit app
pnpm build           # Builds all packages
```

---

## Architecture

The project uses a **hybrid approach** optimised for zero-cost hosting:

| Layer | Tech | Hosting |
|---|---|---|
| Overlay extension | Vite + Svelte 5 | Twitch CDN (uploaded as `app.zip`) |
| Editor + API | SvelteKit | Vercel (free tier) |
| Database | Drizzle ORM + Turso (libSQL) | Turso free tier |

### Data flow

1. An authorised **editor** opens the SvelteKit web app and authenticates via Twitch OAuth.
2. The editor updates the game state via the REST API (`/api/session/...`).
3. The API persists the state to **Turso** and sends a lightweight **Twitch PubSub** notification (≤ 5 KB) to all linked channels to signal that new data is available.
4. Each viewer's **overlay extension** receives the PubSub notification and fetches the full game state from the REST API.

This avoids the need for a persistent WebSocket server while still delivering near-real-time updates. Full state is always available via REST, so the extension can also poll on load or reconnect.

### Session model

```
Session
├── id
├── ownerId          — Twitch user who created the session
├── editors[]        — Twitch users allowed to update game state
├── linkedChannels[] — Channels whose extensions display this session
└── gameState        — Full BotC game state (see packages/shared)
```

---

## Packages

### `@krvavy-chaos/extension`
Plain Vite + Svelte 5 app (no SvelteKit). Built to `dist/` and automatically zipped to `dist/app.zip` for upload to the Twitch Developer Console.

### `@krvavy-chaos/web`
SvelteKit app deployed to Vercel. Serves as both the editor UI and the REST API backend that the extension calls.

### `@krvavy-chaos/shared`
Pure TypeScript package exporting shared types (`GameState`, `Player`, `Session`, `PubSubMessage`, etc.) used by both `extension` and `web`.