"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import useLastFmTopAlbums from '../hooks/useLastFmTopAlbums';
import type { LastFmTopAlbum } from '../types';

const LOADING_GIF = '/images/image-loading-loading.gif';

const LASTFM_PROFILE = 'https://www.last.fm/user/ashutoshsun';

function getImageUrl(album: LastFmTopAlbum, size: 'small' | 'medium' | 'large' | 'extralarge'): string {
  const imgs = album.image ?? [];
  const entry = imgs.find((i) => i.size === size);
  return entry?.['#text'] ?? '';
}

/** Small (34px) image for grainy preview; loads very fast. */
function getPreviewUrl(album: LastFmTopAlbum): string {
  return getImageUrl(album, 'small') || getImageUrl(album, 'medium') || '';
}

/** Full-size for final display (large 174px preferred). */
function getFullUrl(album: LastFmTopAlbum): string {
  return getImageUrl(album, 'large') || getImageUrl(album, 'extralarge') || getImageUrl(album, 'medium') || '';
}

function AlbumTile({ album }: { album: LastFmTopAlbum }) {
  const [fullLoaded, setFullLoaded] = useState(false);
  const previewUrl = getPreviewUrl(album);
  const fullUrl = getFullUrl(album);

  if (!fullUrl) {
    return (
      <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs p-2 text-center">
        {album.name}
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" aria-hidden />
      {/* Grainy preview: small image scaled up, shows immediately */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
      {/* Full-res fades in when loaded */}
      <Image
        src={fullUrl}
        alt={album.name}
        fill
        sizes="(max-width: 380px) 25vw, 100px"
        className="object-cover object-center transition-opacity duration-300"
        style={{ opacity: fullLoaded ? 1 : 0 }}
        onLoad={() => setFullLoaded(true)}
        priority
      />
    </>
  );
}

export default function MusicPopupContent() {
  const { isLoading, albums, error } = useLastFmTopAlbums();

  if (isLoading) {
    return (
      <div className="relative w-[calc(100%+3rem)] h-72 -mx-6 -my-5 flex items-center justify-center">
        <Image
          src={LOADING_GIF}
          alt="Loading..."
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="font-['Raleway']">
      {/* Top 8 albums grid: 4×2, rounded cards with spacing (match film posters) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        {error &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
            >
              —
            </div>
          ))}
        {!error &&
          albums.map((album) => (
            <a
              key={`${album.artist.name}-${album.name}`}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-dark-border-primary shadow-sm hover:shadow-md hover:ring-black/10 dark:hover:ring-dark-border-secondary transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-pink-500/50"
              title={`${album.name} — ${album.artist.name}`}
            >
              <div className="relative aspect-square w-full">
                <AlbumTile album={album} />
              </div>
            </a>
          ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-dark-tertiary leading-relaxed">
        These are my top 8 most-played albums from the past 30 days via{' '}
        <a
          href={LASTFM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-pink-400 hover:underline underline-offset-2"
        >
          Last.fm
        </a>
        .
      </p>
    </div>
  );
}
