"use client";

import React from 'react';
import Image from 'next/image';
import { TOP_FILMS } from '../data/topFilms';
import { getBlurDataURL } from '../constants/blurPlaceholder';

const LETTERBOXD_PROFILE_URL = 'https://letterboxd.com/ashsundresh/';

export default function FilmPopupContent() {
  return (
    <div className="font-['Raleway']">
      {/* Poster grid: 8 cards, 2:3 aspect, clean layout */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        {TOP_FILMS.map((film) => (
          <a
            key={film.filmUrl}
            href={film.filmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-dark-border-primary shadow-sm hover:shadow-md hover:ring-black/10 dark:hover:ring-dark-border-secondary transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-pink-500/50"
            title={film.title}
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={film.posterUrl}
                alt={film.title}
                fill
                sizes="(max-width: 380px) 20vw, 80px"
                placeholder="blur"
                blurDataURL={getBlurDataURL(film.posterUrl)}
                className="object-cover"
              />
            </div>
          </a>
        ))}
      </div>

      <p className="text-sm text-gray-700 dark:text-dark-secondary leading-relaxed">
        I use{' '}
        <a
          href={LETTERBOXD_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-pink-400 hover:underline underline-offset-2"
        >
          Letterboxd
        </a>
        {' '}to log all the films I watch. These are the 8 films I&apos;ve rated the highest.
      </p>
    </div>
  );
}
