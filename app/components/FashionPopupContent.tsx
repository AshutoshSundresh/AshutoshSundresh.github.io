"use client";

import React from 'react';
import Image from 'next/image';
import { getBlurDataURL } from '../constants/blurPlaceholder';
import type { SkeumorphicInterestsData } from '../types';
import skeuData from '../data/skeumorphicInterests.json';

const FASHION_SCREENSHOTS = [
  { file: "fashion-1.webp", alt: "Fashion — photo 1" },
  { file: "fashion-2.webp", alt: "Fashion — photo 2" },
  { file: "fashion-3.webp", alt: "Fashion — photo 3" },
] as const;

export default function FashionPopupContent() {
  const blurb =
    (skeuData as SkeumorphicInterestsData).interests?.Fashion ?? "";

  return (
    <div className="font-['Raleway']">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {FASHION_SCREENSHOTS.map(({ file, alt }) => {
          const src = `/images/${file}`;
          return (
            <div
              key={file}
              className="relative aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-dark-border-primary shadow-sm"
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 380px) 30vw, 120px"
                placeholder="blur"
                blurDataURL={getBlurDataURL(src)}
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-700 dark:text-dark-secondary leading-relaxed whitespace-pre-line">
        {blurb}
      </p>
    </div>
  );
}
