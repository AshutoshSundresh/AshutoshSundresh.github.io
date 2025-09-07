"use client";

import { useEffect, useState } from 'react';
// @ts-ignore
import ColorThief from 'colorthief';

export default function useDominantColor(albumArtUrl: string | null) {
  const [dominantColor, setDominantColor] = useState<number[] | null>(null);

  useEffect(() => {
    if (!albumArtUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = albumArtUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDominantColor(color);
      } catch {
        setDominantColor(null);
      }
    };
  }, [albumArtUrl]);

  return dominantColor;
}


