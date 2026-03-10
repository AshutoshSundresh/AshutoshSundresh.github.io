"use client";

import React from 'react';
import Image from 'next/image';
import { getBlurDataURL } from '../constants/blurPlaceholder';

const DIORAMA_IMAGES = [
  { src: '/images/diorama.jpg', alt: 'Diorama display' },
  { src: '/images/pagani.png', alt: 'Pagani model' },
  { src: '/images/f1_diorama.webp', alt: 'F1 diorama' },
  { src: '/images/gtr-diorama.jpg', alt: 'GTR diorama' },
  { src: '/images/offroad.jpg', alt: 'Offroad scene' },
  { src: '/images/porsche-diorama.jpg', alt: 'Porsche diorama' },
];

export default function DiecastCarsPopupContent() {
  return (
    <div className="font-['Raleway']">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {DIORAMA_IMAGES.map(({ src, alt }) => (
          <div
            key={src}
            className="relative aspect-square rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-dark-border-primary shadow-sm"
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
        ))}
      </div>
      <p className="text-sm text-gray-700 dark:text-dark-secondary leading-relaxed">
        I build paper dioramas to display my cars and I mainly buy 1:64 models from Hot Wheels, MiniGT, Kyosho, Tomica, and Tarmac Works.
      </p>
    </div>
  );
}
