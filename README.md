# Ashutosh Sundresh — Portfolio

Next.js portfolio showcasing projects, research, and experience with a performant, macOS Finder–inspired UI and interactive visuals.

## Highlights

- macOS Finder–style desktop with tabs, history, and detail panes (desktop/mobile-optimized)
- Global Conway's Game of Life canvas with window-level pointer capture (works under overlays)
- Live "Now Playing" widget via Last.fm API with dominant color extraction
- Skeuomorphic experience view with awards, publications, activities, and deep links
- iOS-style lockscreen and terminal overlays
- Coursework calendar view with quarter-based filtering and major filtering

## Architecture

- **Frontend**: Next.js 15 App Router with React 19 and TypeScript
- **State**: Custom hooks for data fetching, color extraction, swipe/gesture, pin entry, clocks, and theme management
- **UI**: Component-based architecture with reusable UI under `app/components` and centralized types in `app/types.ts`
- **Styling**: Tailwind CSS with minimal global utilities in `app/globals.css` for shared effects (glass, blur, terminal)

## Tech Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS
- Leaflet (maps), DnD Kit (drag-and-drop for intro cards)
- Zustand (state), date-fns (time utilities)
- Lucide React (icons), color-thief (dominant color extraction)

## Local Development

1. Install deps: `npm i`
2. Start dev server: `npm run dev`
3. Visit: `http://localhost:3000`

**Optional env** (for Now Playing):

```
NEXT_PUBLIC_LASTFM_API_KEY=...
NEXT_PUBLIC_LASTFM_USER=...
```
