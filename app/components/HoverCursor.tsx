"use client";

import { useEffect, useState } from 'react';

const _isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

let _latestPos = { x: 0, y: 0 };
if (_isFinePointer) {
  window.addEventListener(
    'mousemove',
    (e) => { _latestPos = { x: e.clientX, y: e.clientY }; },
    { passive: true }
  );
}

interface HoverCursorProps {
  /** When omitted, renders image-only with no box or background */
  text?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function HoverCursor({ text, imageSrc, imageAlt = '' }: HoverCursorProps) {
  const [pos, setPos] = useState(_latestPos);

  useEffect(() => {
    if (!_isFinePointer) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!_isFinePointer) return null;

  if (!text) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={imageAlt}
        className="fixed pointer-events-none z-[99999]"
        style={{ left: pos.x, top: pos.y }}
      />
    );
  }

  return (
    <div
      className="fixed pointer-events-none z-[99999] flex items-stretch bg-white overflow-hidden"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    >
      <span className="font-array text-sm text-black px-3 flex items-center whitespace-nowrap">
        {text}
      </span>
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-auto object-cover self-stretch"
        />
      )}
    </div>
  );
}
