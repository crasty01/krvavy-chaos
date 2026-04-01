# Copilot Instructions

## Project

Twitch **Video Overlay** extension for the Czech Blood on the Clocktower (BotC) community stream "Krvavá hodina odbila".

Monorepo with three packages:
- `packages/extension` — Vite + Svelte 5 static overlay (uploaded to Twitch CDN)
- `packages/web` — SvelteKit editor app + API (deployed to Vercel)
- `packages/shared` — shared TypeScript types

## Tech Stack

### Extension (`packages/extension`)
- **Svelte 5** (runes, `.svelte.ts` stores) + **TypeScript** + **Vite**
- Package manager: **pnpm**
- Build output zipped to `app.zip` via `vite-plugin-zip-pack` for Twitch extension upload
- No SvelteKit — this is a plain Vite + Svelte app

### Web (`packages/web`)
- **SvelteKit** + **TypeScript** + `@sveltejs/adapter-vercel`
- **Drizzle ORM** + **Turso** (libSQL) for database
- Twitch OAuth for editor authentication
- Twitch Extension JWT verification for extension API requests

### Shared (`packages/shared`)
- Pure **TypeScript** — no framework dependencies
- Exports types and constants used by both extension and web

## JavaScript / TypeScript
- **Arrow functions** (`=>`) instead of `function` keyword — everywhere (components, handlers, utilities)
- **`const` / `let`** only — never `var`
- **Destructuring**, **optional chaining** (`?.`), **nullish coalescing** (`??`) — use liberally
- **Named exports** preferred over default exports
- **`type`** aliases instead of `interface` — use `type Foo = { … }` everywhere
- Modern ES2023 target

## Svelte
- Svelte 5 runes API: `$state`, `$derived`, `$effect`, `$props`, `$bindable`
- Snippet-based composition over slots (Svelte 5 pattern)
- Store files use `.svelte.ts` extension
- Component files use PascalCase: `CharacterPool.svelte`

## CSS
- **`rem`** for sizing — never `em` (exception: `letter-spacing`)
- Scoped styles in `<style>` blocks within components
- Global styles only in `app.css`

## Language
- **Czech** for all user-facing UI strings (labels, tooltips, messages)
- **English** for variable names, function names, comments, commits, and documentation
