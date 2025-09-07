"use client";

import { useEffect, useState } from 'react';
import type { NowPlayingTrack, LastFmResponse } from '../types';

export default function useLastFmNowPlaying() {
  const [isLoading, setIsLoading] = useState(true);
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
        const user = process.env.NEXT_PUBLIC_LASTFM_USER;
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=1`
        );
        const data: LastFmResponse = await response.json();
        if (data.recenttracks?.track?.[0]) {
          setTrack(data.recenttracks.track[0]);
          setError(null);
        } else {
          setTrack(null);
          setError('No track');
        }
      } catch {
        setError('Failed to fetch track data');
        setTrack(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isLoading, track, error };
}


