"use client";

import React from 'react';
import Image from 'next/image';
import type { ThumbLink } from '../types';
import { getBlurDataURL } from '../constants/blurPlaceholder';
import { HAIRLINE, UI_FONT_STACK } from './skeumorphic/macos';

interface ThumbLinkCardProps {
  link: ThumbLink;
  isMobile?: boolean;
}

/** Bare host, the way AppKit captions a rich link. */
function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Rich link card, modelled on the ones AppKit renders in Notes and Messages
 * rather than on a web link-preview widget. The differences are what make it
 * read native: the host as a secondary caption, the system text style, radii
 * that stay concentric (inner = outer − padding), and no external-link
 * chevron — the card itself is the affordance.
 */
export default function ThumbLinkCard({ link, isMobile = false }: ThumbLinkCardProps) {
  const host = hostOf(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{ fontFamily: UI_FONT_STACK }}
      className={`group block overflow-hidden border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 ${HAIRLINE} ${
        isMobile
          ? 'rounded-[14px] bg-black/[0.02] active:bg-black/[0.05] dark:bg-white/[0.04] dark:active:bg-white/[0.08]'
          : 'flex items-center gap-3 rounded-[12px] p-1.5 bg-black/[0.02] hover:bg-black/[0.045] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]'
      }`}
    >
      {/* Narrow widths stack the art above the caption, the way Messages and
          Notes lay a rich link out when there is no room for a side thumb.
          That keeps the whole title readable instead of truncating it. */}
      <div
        className={`relative shrink-0 overflow-hidden bg-black/[0.06] dark:bg-white/[0.07] ${
          isMobile
            ? 'aspect-[1.91/1] w-full border-b ' + HAIRLINE
            : 'h-[58px] w-[104px] rounded-[6px] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.10)] dark:shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.10)]'
        }`}
      >
        {link.image && (
          <Image
            src={link.image}
            alt=""
            fill
            sizes={isMobile ? '100vw' : '104px'}
            placeholder="blur"
            blurDataURL={getBlurDataURL(link.image)}
            className="object-cover"
          />
        )}
      </div>

      <div className={isMobile ? 'px-3 py-2.5' : 'min-w-0 flex-1 pr-1'}>
        <p
          className={`font-semibold leading-snug text-[#1d1d1f] dark:text-white/90 ${
            isMobile ? 'text-[0.86rem]' : 'line-clamp-2 text-[0.8rem]'
          }`}
        >
          {link.title}
        </p>
        {host && (
          <p className={`mt-1 truncate text-[#3c3c43]/55 dark:text-white/45 ${isMobile ? 'text-[0.72rem]' : 'text-[0.69rem]'}`}>
            {host}
          </p>
        )}
      </div>
    </a>
  );
}
