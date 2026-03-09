/** Top 8 from Letterboxd. Refresh: TMDB_API_KEY=key npm run scrape-letterboxd */
import topFilmsJson from './topFilms.json';

export interface TopFilm {
  title: string;
  posterUrl: string;
  filmUrl: string;
}

export const TOP_FILMS: TopFilm[] = topFilmsJson as TopFilm[];
