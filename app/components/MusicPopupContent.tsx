"use client";

import React from 'react';
import Image from 'next/image';
import useLastFmTopAlbums from '../hooks/useLastFmTopAlbums';
import { BLUR_DATA_URL } from '../constants/blurPlaceholder';
import type { LastFmTopAlbum } from '../types';

const LASTFM_PROFILE = 'https://www.last.fm/user/ashutoshsun';

/** Prefer large (174px) over extralarge (300px) for faster loads; tiles are small in the grid. */
function getAlbumImageUrl(album: LastFmTopAlbum): string {
  const imgs = album.image ?? [];
  const large = imgs.find((i) => i.size === 'large');
  const extralarge = imgs.find((i) => i.size === 'extralarge');
  const medium = imgs.find((i) => i.size === 'medium');
  const url = (large ?? extralarge ?? medium)?.['#text'] ?? '';
  return url || '';
}

export default function MusicPopupContent() {
  const { isLoading, albums, error } = useLastFmTopAlbums();

  return (
    <div className="font-['Raleway']">
      {/* Top 8 albums grid: 4×2, no gaps */}
      <div className="grid grid-cols-4 gap-0 mb-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"
              aria-hidden
            />
          ))}
        {!isLoading &&
          error &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
            >
              —
            </div>
          ))}
        {!isLoading &&
          !error &&
          albums.map((album) => {
            const imgUrl = getAlbumImageUrl(album);
            return (
              <a
                key={`${album.artist.name}-${album.name}`}
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-pink-500/50"
                title={`${album.name} — ${album.artist.name}`}
              >
                <div className="relative aspect-square w-full">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={album.name}
                      fill
                      sizes="(max-width: 380px) 25vw, 100px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs p-2 text-center">
                      {album.name}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
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
