"use client";

import { useMemo, useRef, useEffect } from 'react';
import useLastFmNowPlaying from '../hooks/useLastFmNowPlaying';
import useDominantColor from '../hooks/useDominantColor';
import useIntroVisibility from '../hooks/useIntroVisibility';
import { useTooltip } from '../hooks/useTooltip';
import Tooltip from './ui/Tooltip';
import InfoButton from './ui/InfoButton';

import type { NowPlayingTrack, NowPlayingProps } from '../types';

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
  const { isLoading, track, error } = useLastFmNowPlaying();
  const { show, firstLaunch } = useIntroVisibility();
  const { showTooltip, tooltipPosition, buttonRef, handleMouseEnter, handleMouseLeave } = useTooltip();
  const imgRef = useRef<HTMLImageElement>(null);

  const albumArtUrl = useMemo(() => (
    (track as NowPlayingTrack | null)?.image?.find(img => img.size === 'extralarge')?.['#text'] || (track as NowPlayingTrack | null)?.image?.slice(-1)[0]?.['#text'] || ''
  ), [track]);
  const dominantColor = useDominantColor(albumArtUrl || null);

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
                <InfoButton
                  buttonRef={buttonRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className={textColor}
                />
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
      
      {show && showInfoButton && (
        <Tooltip show={showTooltip} position={tooltipPosition}>
          I have last.fm only connected to my personal laptop&apos;s music player, so I was probably listening to music on another device over the past {timeAgo?.replace(' ago', '')}
        </Tooltip>
      )}
    </>
  );
}
