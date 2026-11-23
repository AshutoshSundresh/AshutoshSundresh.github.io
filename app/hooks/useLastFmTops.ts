"use client";

import { useEffect, useState } from 'react';
import type {
  LastFmPeriod,
  LastFmTopAlbum,
  LastFmTopAlbumsResponse,
  LastFmTopArtist,
  LastFmTopArtistsResponse,
} from '../types';
import { DAY, readCache, writeCache } from '../lib/persistentCache';

const TILE_COUNT = 6;
/** Deep enough to find a cover for each top artist, cheap enough for one call. */
const ALBUM_LOOKUP_LIMIT = 100;

const ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';

/** An artist's photo effectively never changes; their play counts do. */
const PHOTO_TTL = 30 * DAY;
const MISS_TTL = DAY;
const TOPS_TTL = 6 * 60 * 60 * 1000;

export interface ArtistTile {
  name: string;
  playcount: string;
  url: string;
  /** Cover of this artist's most-played album, since the API has no artist art. */
  coverUrl: string;
}

function imageFrom(images: { size: string; '#text': string }[] | undefined, size: string): string {
  return images?.find((i) => i.size === size)?.['#text'] ?? '';
}

function bestCover(album: LastFmTopAlbum): string {
  return (
    imageFrom(album.image, 'extralarge') ||
    imageFrom(album.image, 'large') ||
    imageFrom(album.image, 'medium') ||
    ''
  );
}

/**
 * Real artist photos, which Last.fm's API does not provide. Deezer's search
 * sends no access-control-allow-origin, so a plain fetch would be blocked and
 * this goes through their JSONP output instead. Every failure path resolves to
 * an empty string so the caller can fall back to album art.
 */
function deezerArtistImage(name: string, timeoutMs = 6000): Promise<string> {
  const cacheKey = `artist:${name.trim().toLowerCase()}`;
  const cached = readCache<string>(cacheKey);
  // A cached miss is worth keeping too: it stops an artist Deezer does not
  // carry from firing a lookup on every open.
  if (cached !== null) return Promise.resolve(cached);

  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve('');
      return;
    }
    const callback = `__dzArtist_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    let settled = false;

    const finish = (url: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      delete (window as unknown as Record<string, unknown>)[callback];
      script.remove();
      // Successes are stable, but a miss may just be a timeout or a blip, so
      // it expires quickly rather than suppressing retries for a month.
      writeCache(cacheKey, url, url ? PHOTO_TTL : MISS_TTL);
      resolve(url);
    };

    const timer = setTimeout(() => finish(''), timeoutMs);

    (window as unknown as Record<string, unknown>)[callback] = (payload: {
      data?: { name?: string; nb_fan?: number; picture_xl?: string; picture_big?: string }[];
    }) => {
      const wanted = name.trim().toLowerCase();
      // Search is fuzzy and name collisions are common — "Drake" alone returns
      // four artists — so keep only exact name matches and take the most
      // followed of those. Anything else would put the wrong face on the tile.
      const best = (payload?.data ?? [])
        .filter((a) => a?.name?.trim().toLowerCase() === wanted)
        .sort((a, b) => (b.nb_fan ?? 0) - (a.nb_fan ?? 0))[0];
      finish(best?.picture_xl || best?.picture_big || '');
    };

    script.onerror = () => finish('');
    script.src = `https://api.deezer.com/search/artist?limit=10&output=jsonp&callback=${callback}&q=${encodeURIComponent(
      name
    )}`;
    document.head.appendChild(script);
  });
}

function request(method: string, period: LastFmPeriod, limit: number, apiKey: string, user: string) {
  const params = new URLSearchParams({
    method,
    user,
    // The build injects this secret with a trailing newline, which Last.fm
    // rejects once it is percent-encoded into the query string.
    api_key: apiKey.trim(),
    period,
    limit: String(limit),
    format: 'json',
  });
  return fetch(`${ENDPOINT}?${params.toString()}`).then((r) => r.json());
}

export default function useLastFmTops(period: LastFmPeriod) {
  const [isLoading, setIsLoading] = useState(true);
  const [artists, setArtists] = useState<ArtistTile[]>([]);
  const [albums, setAlbums] = useState<LastFmTopAlbum[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
        const user = process.env.NEXT_PUBLIC_LASTFM_USER;
        if (!apiKey || !user) {
          if (!cancelled) {
            setError('Missing Last.fm config');
            setArtists([]);
            setAlbums([]);
          }
          return;
        }

        // Only the twelve tiles are cached, not the hundred-album response the
        // covers are derived from — that would be megabytes across periods.
        const topsKey = `tops:${period}`;
        let trimmed = readCache<{ artists: ArtistTile[]; albums: LastFmTopAlbum[] }>(topsKey);

        if (!trimmed) {
          const [artistData, albumData]: [LastFmTopArtistsResponse, LastFmTopAlbumsResponse] =
            await Promise.all([
              request('user.getTopArtists', period, TILE_COUNT, apiKey, user),
              request('user.getTopAlbums', period, ALBUM_LOOKUP_LIMIT, apiKey, user),
            ]);

          if (cancelled) return;

          if (artistData.error || albumData.error) {
            setError(artistData.message ?? albumData.message ?? 'Last.fm error');
            setArtists([]);
            setAlbums([]);
            return;
          }

          const albumList = Array.isArray(albumData.topalbums?.album)
            ? albumData.topalbums!.album
            : [];
          const artistList = Array.isArray(artistData.topartists?.artist)
            ? artistData.topartists!.artist
            : [];

          // getTopAlbums comes back ordered by playcount, so the first album
          // for an artist is their most-played one.
          const coverByArtist = new Map<string, string>();
          for (const album of albumList) {
            const key = album.artist?.name?.toLowerCase();
            if (!key || coverByArtist.has(key)) continue;
            const cover = bestCover(album);
            if (cover) coverByArtist.set(key, cover);
          }

          trimmed = {
            artists: artistList.slice(0, TILE_COUNT).map((artist: LastFmTopArtist) => ({
              name: artist.name,
              playcount: artist.playcount,
              url: artist.url,
              coverUrl: coverByArtist.get(artist.name.toLowerCase()) ?? '',
            })),
            albums: albumList.slice(0, TILE_COUNT),
          };
          writeCache(topsKey, trimmed, TOPS_TTL);
        }

        if (cancelled) return;

        const topArtists = trimmed.artists;
        const albumArtFor = (artist: ArtistTile) => artist.coverUrl;

        // Show album art straight away, then upgrade to the real photo. With
        // the photos already cached this second pass resolves synchronously
        // and the swap is never visible.
        setArtists(topArtists);
        setAlbums(trimmed.albums);
        setError(null);

        const photos = await Promise.all(
          topArtists.map((artist: ArtistTile) => deezerArtistImage(artist.name))
        );
        if (cancelled) return;
        setArtists(
          topArtists.map((artist: ArtistTile, i: number) => ({
            ...artist,
            coverUrl: photos[i] || albumArtFor(artist),
          }))
        );
      } catch {
        if (!cancelled) {
          setError('Failed to fetch Last.fm data');
          setArtists([]);
          setAlbums([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [period]);

  return { isLoading, artists, albums, error };
}
