# Ashutosh Sundresh — Portfolio

Next.js app showcasing projects, research, and experience with a performant, macOS Finder–inspired UI and interactive visuals.

## Highlights

- macOS Finder–style desktop with tabs, history, and detail panes (desktop/mobile-optimized)
- Global Conway’s Game of Life canvas with window-level pointer capture (works under overlays)
- Live “Now Playing” widget via Last.fm API with dominant color extraction
- Skeuomorphic experience view with awards, publications, activities, and deep links
- iOS-style lockscreen and terminal overlays

## Architecture

- App Router (`/app`) with route components and reusable UI under `app/components`
- Feature logic factored into typed hooks: data fetching, color extraction, swipe/gesture, pin entry, clocks
- Strict TypeScript with centralized domain types in `app/types.ts`
- CSS: Tailwind plus minimal global utilities in `app/globals.css` for shared effects (glass, blur, terminal)

## Tech Stack 

- Next.js 15, React 19, TypeScript
- Tailwind CSS

## Local Development

1. Install deps: `npm i`
2. Start dev server: `npm run dev`
3. Visit: `http://localhost:3000`

Optional env (for Now Playing):

```
NEXT_PUBLIC_LASTFM_API_KEY=...
NEXT_PUBLIC_LASTFM_USER=...
```
