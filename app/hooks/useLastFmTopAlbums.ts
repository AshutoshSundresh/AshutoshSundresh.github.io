"use client";

import { useEffect, useState } from 'react';
import type { LastFmTopAlbum, LastFmTopAlbumsResponse } from '../types';

const LIMIT = 8;
const PERIOD = '1month';

export default function useLastFmTopAlbums() {
  const [isLoading, setIsLoading] = useState(true);
  const [albums, setAlbums] = useState<LastFmTopAlbum[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopAlbums = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
        const user = process.env.NEXT_PUBLIC_LASTFM_USER;
        if (!apiKey || !user) {
          setError('Missing Last.fm config');
          setAlbums([]);
          return;
        }
        const params = new URLSearchParams({
          method: 'user.getTopAlbums',
          user,
          api_key: apiKey,
          period: PERIOD,
          limit: String(LIMIT),
          format: 'json',
        });
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`);
        const data: LastFmTopAlbumsResponse = await response.json();
        if (data.error) {
          setError(data.message ?? 'Last.fm error');
          setAlbums([]);
          return;
        }
        const list = data.topalbums?.album ?? [];
        setAlbums(Array.isArray(list) ? list : []);
        setError(null);
      } catch {
        setError('Failed to fetch top albums');
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAlbums();
  }, []);

  return { isLoading, albums, error };
}
