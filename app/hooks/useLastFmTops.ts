"use client";

import { useEffect, useState } from 'react';
import type {
  LastFmPeriod,
  LastFmTopAlbum,
  LastFmTopAlbumsResponse,
  LastFmTopArtist,
  LastFmTopArtistsResponse,
} from '../types';

const TILE_COUNT = 6;
/** Deep enough to find a cover for each top artist, cheap enough for one call. */
const ALBUM_LOOKUP_LIMIT = 100;

const ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';

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

        const albumList = Array.isArray(albumData.topalbums?.album) ? albumData.topalbums!.album : [];
        const artistList = Array.isArray(artistData.topartists?.artist)
          ? artistData.topartists!.artist
          : [];

        // getTopAlbums comes back ordered by playcount, so the first album for
        // an artist is their most-played one.
        const coverByArtist = new Map<string, string>();
        for (const album of albumList) {
          const key = album.artist?.name?.toLowerCase();
          if (!key || coverByArtist.has(key)) continue;
          const cover = bestCover(album);
          if (cover) coverByArtist.set(key, cover);
        }

        setArtists(
          artistList.slice(0, TILE_COUNT).map((artist: LastFmTopArtist) => ({
            name: artist.name,
            playcount: artist.playcount,
            url: artist.url,
            coverUrl: coverByArtist.get(artist.name.toLowerCase()) ?? '',
          }))
        );
        setAlbums(albumList.slice(0, TILE_COUNT));
        setError(null);
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
