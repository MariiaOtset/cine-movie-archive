# CINÉ / ARCHIVE

**CINÉ / ARCHIVE** is a cinematic movie discovery experience featuring dynamic editorial collections and personal watchlists. Built as a portfolio showcase with React and the TMDB API.

## Features
- Immersive hero with live movie artwork and film metadata
- Trending, popular, top-rated and upcoming sections
- Browse by genre or mood and search by title, year and rating
- Movie detail pages with synopsis, cast, audience reviews, official trailer (when available) and recommendations
- Dedicated watchlist, persisted locally with no sign-up
- Responsive layouts, image placeholders, error and loading states

## Stack
React 18 · Vite · React Router · Axios · CSS Modules · TMDB API

## Local development
```bash
npm ci
npm run dev
npm run build
npm run lint
```

Optional Vite variable: `VITE_TMDB_READ_ACCESS_TOKEN` (TMDB read-access token). Browser `VITE_` variables are **public**, not secret. The existing public demo token is retained as fallback to keep the original deployment working; rotate it if access must be restricted and use a server-side proxy for genuine credential secrecy.

**Data notice:** Movie data, imagery and trailers are provided by third-party services. Availability varies by title and API limits.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Project status
Portfolio modernization on `feat/portfolio-redesign-v1`. Do not merge until browser and mobile QA are complete. The production deployment on `main` may still show the original design.

Created by [Mariia Otset](https://github.com/MariiaOtset).

## V2 — movie-night discovery and watched tracking

- An interactive Movie Night Picker offers a surprise title from the currently loaded TMDB collections, narrowed by a film mood/genre when a match exists.
- Watchlist supports **To watch / Watched** tabs, title and rating sorting, and persistent watched-state tracking in localStorage.
- A watchlist dashboard shows saved, watched and unwatched counts, plus a surprise pick from unwatched films.
- Removing a film from the watchlist also clears its watched status; neither favourites nor watched state requires an account.

The movie-night picker is based on the current editorial pool, **not** the entire TMDB catalog. It may show no match for a particular mood.
