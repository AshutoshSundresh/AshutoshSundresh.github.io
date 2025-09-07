"use client";

import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import ColorThief from 'colorthief';

interface Track {
  name: string;
  artist: {
    "#text": string;
  };
  album: {
    "#text": string;
  };
  image: { size: string; "#text": string }[];
  "@attr"?: {
    nowplaying: string;
  };
  date?: {
    uts: string;
    "#text": string;
  };
  url: string;
}

interface LastFmResponse {
  recenttracks: {
    track: Track[];
  };
}

interface NowPlayingProps {
  onStatusChange?: (status: 'playing' | 'recent' | null) => void;
  onTrackChange?: (track: { name: string; artist: string } | null) => void;
}

function rgbToHex(rgb: number[]) {
  return (
    '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('')
  );
}

function getLuminance([r, g, b]: number[]) {
  // Standard luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getTimeAgo(unixTimestamp: string): string {
  const now = new Date();
  const played = new Date(parseInt(unixTimestamp) * 1000);
  const diffInSeconds = Math.floor((now.getTime() - played.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 2592000) { // 30 days
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
    // if I die 
  } else if (diffInSeconds < 31536000) { // 365 days
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}mo ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}y ago`;
  }
}

// keyframes for gradient flow are defined in globals.css

export default function NowPlaying({ onStatusChange, onTrackChange }: NowPlayingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dominantColor, setDominantColor] = useState<number[] | null>(null);
  const [show, setShow] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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
    } catch (err) {
      setError('Failed to fetch track data');
      setTrack(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    // fetch every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  // extract dominant color from album art
  useEffect(() => {
    if (!track) return;
    const albumArt = track.image?.find(img => img.size === 'extralarge')?.['#text'] || track.image?.slice(-1)[0]?.['#text'] || '';
    if (!albumArt) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = albumArt;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDominantColor(color);
      } catch (e) {
        setDominantColor(null);
      }
    };
  }, [track]);

  // Hide widget when #intro-text is not in view
  useEffect(() => {
    const section = document.getElementById('intro-text');
    if (!section) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
        if (firstLaunch && entry.isIntersecting) {
          setFirstLaunch(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [firstLaunch]);

  // Notify parent of status and track info
  useEffect(() => {
    if (!onStatusChange && !onTrackChange) return;
    
    if (!track) {
      onStatusChange?.(null);
      onTrackChange?.(null);
    } else {
      onStatusChange?.(track["@attr"]?.nowplaying ? 'playing' : 'recent');
      onTrackChange?.({
        name: track.name,
        artist: track.artist["#text"]
      });
    }
  }, [track, onStatusChange, onTrackChange]);

  if (isLoading || error || !track || (firstLaunch && !show)) return null;

  const albumArt = track.image?.find(img => img.size === 'extralarge')?.['#text'] || track.image?.slice(-1)[0]?.['#text'] || '';
  const artist = track.artist["#text"];
  const album = track.album?.["#text"] || '';
  const isNowPlaying = !!track["@attr"]?.nowplaying;
  const timeAgo = track.date?.uts ? getTimeAgo(track.date.uts) : null;
  const showInfoButton = timeAgo && (timeAgo.includes('d ago') || timeAgo.includes('mo ago') || timeAgo.includes('y ago'));

  // gradient background based on dominant color
  let bgGradient = 'from-gray-800 to-gray-900';
  let textColor = 'text-white';
  if (dominantColor) {
    const hex = rgbToHex(dominantColor);
    bgGradient = `bg-[linear-gradient(90deg,${hex} 0%,${hex} 50%,${hex} 100%)]`;
    textColor = getLuminance(dominantColor) > 180 ? 'text-gray-900' : 'text-white';
  }

  return (
    <>
      <div
        className={`fixed top-4 left-1/2 z-50 w-full max-w-md px-2
          ${show ? 'opacity-100 translate-y-0 pointer-events-auto animate-fade-in' : 'opacity-0 -translate-y-4 pointer-events-none animate-fade-out'}
          transform -translate-x-1/2 transition-all duration-500 ease-in-out`
        }
      >
        <div
          className={`flex items-center rounded-2xl p-3 gap-4 relative ${bgGradient} lavalamp-bg overflow-visible`}
          style={{
            background: dominantColor
              ? `linear-gradient(90deg, 
                  ${rgbToHex(dominantColor)} 0%, 
                  ${rgbToHex(dominantColor)} 50%,
                  ${rgbToHex(dominantColor)} 100%)`
              : undefined,
            backgroundSize: '200% 200%',
            animation: 'gradientFlow 8s ease infinite'
          }}
        >
        <div className="absolute inset-y-0 left-0 w-1/4 overflow-hidden rounded-l-2xl">
          <img
            ref={imgRef}
            src={albumArt}
            alt={track.name + ' album art'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`relative flex-1 min-w-0 pl-[calc(25%+0.5rem)] ${textColor} overflow-visible`}>
          <div className="text-xs font-semibold tracking-widest mb-1 opacity-80 flex items-center gap-1">
            <span>{isNowPlaying ? 'NOW PLAYING' : `LAST PLAYED${timeAgo ? ` • ${timeAgo}` : ''}`}</span>
            {showInfoButton && (
              <div className="relative inline-block -mb-1">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`opacity-50 hover:opacity-80 transition-opacity duration-200 ${textColor}`}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-lg font-bold truncate hover:underline ${textColor}`}
            title={track.name}
          >
            {track.name}
          </a>
          <div className={`text-sm opacity-90 truncate ${textColor}`} title={artist}>{artist}</div>
          {album && (
            <div className={`text-xs opacity-70 truncate ${textColor}`} title={album}>{album}</div>
          )}
        </div>
        </div>
      </div>
      
      {/* Tooltip rendered outside the blurred container */}
      {showInfoButton && showTooltip && (
        <div 
          className="fixed z-[10000] pointer-events-none top-20 left-1/2 -translate-x-1/2"
        >
          <div 
            className="text-white text-xs px-4 py-3 rounded-lg shadow-2xl w-80 whitespace-normal border border-white/10 glass-16" 
          >
            I have last.fm only connected to my personal laptop's music player, so I was probably listening to music on another device over the past {timeAgo?.replace(' ago', '')}
          </div>
        </div>
      )}
    </>
  );
}