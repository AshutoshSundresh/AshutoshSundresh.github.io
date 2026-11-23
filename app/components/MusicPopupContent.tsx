"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import useLastFmTops, { type ArtistTile } from '../hooks/useLastFmTops';
import type { LastFmPeriod, LastFmTopAlbum } from '../types';

const LASTFM_PROFILE = 'https://www.last.fm/user/ashutoshsun';

const PERIODS: { id: LastFmPeriod; label: string }[] = [
  { id: 'overall', label: 'All time' },
  { id: '3month', label: '90 days' },
];

function formatPlays(playcount: string): string {
  const n = Number(playcount);
  return Number.isFinite(n) ? n.toLocaleString() : playcount;
}

function imageFrom(images: { size: string; '#text': string }[] | undefined, size: string): string {
  return images?.find((i) => i.size === size)?.['#text'] ?? '';
}

/**
 * Square cover with the name and play count over a scrim, the way Last.fm
 * lays out its own top-albums grid.
 */
function Tile({
  href,
  cover,
  title,
  subtitle,
  playcount,
}: {
  href: string;
  cover: string;
  title: string;
  subtitle?: string;
  playcount: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={subtitle ? `${title} — ${subtitle}` : title}
      className="group relative block aspect-square overflow-hidden rounded-lg ring-1 ring-black/5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 dark:ring-dark-border-primary"
    >
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" aria-hidden />
      {cover && (
        <Image
          src={cover}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 420px) 33vw, 140px"
          className="object-cover object-center transition-[opacity,transform] duration-300 group-hover:scale-[1.04]"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
        />
      )}
      {/* Scrim keeps the label legible over bright artwork */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-2 pb-1.5 pt-6">
        <p className="truncate text-[11px] font-semibold leading-tight text-white">{title}</p>
        {subtitle && <p className="truncate text-[10px] leading-tight text-white/70">{subtitle}</p>}
        <p className="text-[10px] leading-tight text-white/60 tabular-nums">
          {formatPlays(playcount)} plays
        </p>
      </div>
    </a>
  );
}

function Grid({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {heading}
      </h3>
      <div className="grid grid-cols-3 gap-2">{children}</div>
    </section>
  );
}

function Placeholders() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-lg bg-gray-200/70 dark:bg-gray-700/50"
        />
      ))}
    </>
  );
}

export default function MusicPopupContent() {
  const [period, setPeriod] = useState<LastFmPeriod>('overall');
  const { isLoading, artists, albums, error } = useLastFmTops(period);

  return (
    <div className="font-['Raleway']">
      <div className="mb-3 flex items-center gap-[2px] rounded-[8px] bg-black/[0.055] p-[2px] dark:bg-white/[0.08]">
        {PERIODS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPeriod(id)}
            aria-pressed={period === id}
            className={`h-[26px] flex-1 rounded-[6px] text-[12px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 ${
              period === id
                ? 'bg-white font-medium text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.16),0_0_0_0.5px_rgba(0,0,0,0.06)] dark:bg-[#5a5a5e] dark:text-white dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Grid heading="Top artists">
        {isLoading || error ? (
          <Placeholders />
        ) : (
          artists.map((artist: ArtistTile) => (
            <Tile
              key={artist.name}
              href={artist.url}
              cover={artist.coverUrl}
              title={artist.name}
              playcount={artist.playcount}
            />
          ))
        )}
      </Grid>

      <Grid heading="Top albums">
        {isLoading || error ? (
          <Placeholders />
        ) : (
          albums.map((album: LastFmTopAlbum) => (
            <Tile
              key={`${album.artist.name}-${album.name}`}
              href={album.url}
              cover={
                imageFrom(album.image, 'extralarge') ||
                imageFrom(album.image, 'large') ||
                imageFrom(album.image, 'medium')
              }
              title={album.name}
              subtitle={album.artist.name}
              playcount={album.playcount}
            />
          ))
        )}
      </Grid>

      <p className="text-sm leading-relaxed text-gray-600 dark:text-dark-tertiary">
        {error
          ? 'Could not reach Last.fm just now. '
          : `My most-played artists and albums ${
              period === 'overall' ? 'of all time' : 'over the last 90 days'
            }, via `}
        <a
          href={LASTFM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 blur-on-hover dark:text-pink-400"
        >
          Last.fm
        </a>
        .
      </p>
    </div>
  );
}
