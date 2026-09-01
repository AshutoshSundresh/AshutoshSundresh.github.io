'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Moon, Search, Sun, Terminal } from 'lucide-react';
import type { WindowHeaderProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import TrafficLights from './skeumorphic/TrafficLights';
import { CHROME_MATERIAL, HAIRLINE, TOOLBAR_BUTTON, UI_FONT_STACK } from './skeumorphic/macos';

/**
 * Unified toolbar — Big Sur onward merges the title bar and toolbar into a
 * single row: window controls at the leading edge, title centred, actions
 * trailing. Replaces the old three-bar stack.
 */
export default function WindowHeader({
  onToggleLockscreen,
  onOpenTerminal,
  onOpenSearch,
  onBack,
  onForward,
  canBack,
  canForward,
  onZoom,
  isZoomed,
  showArchive,
  title = 'Explore',
  subtitle,
}: WindowHeaderProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`relative flex h-[52px] shrink-0 items-center gap-3 border-b px-4 ${HAIRLINE} ${CHROME_MATERIAL}`}
      style={{ fontFamily: UI_FONT_STACK }}
    >
      {/* Leading: window controls + history */}
      <div className="relative z-10 flex items-center gap-3">
        <TrafficLights
          onClose={() => router.push('/')}
          onMinimize={onToggleLockscreen}
          onZoom={onZoom}
          isZoomed={isZoomed}
        />

        <div className="ml-1 flex items-center gap-0.5">
          <button type="button" onClick={onBack} disabled={!canBack} className={TOOLBAR_BUTTON} aria-label="Back" title="Back">
            <ChevronLeft className="h-[17px] w-[17px]" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            onClick={onForward}
            disabled={!canForward}
            className={TOOLBAR_BUTTON}
            aria-label="Forward"
            title="Forward"
          >
            <ChevronRight className="h-[17px] w-[17px]" strokeWidth={2.1} />
          </button>
        </div>
      </div>

      {/* Centred title — pointer-events-none so it never eats toolbar clicks */}
      <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-semibold leading-tight text-[#1d1d1f] dark:text-white/90">{title}</span>
        {subtitle && (
          <span className="text-[10px] leading-tight text-[#3c3c43]/55 dark:text-white/45">{subtitle}</span>
        )}
      </div>

      {/* Trailing actions */}
      <div className="relative z-10 ml-auto flex items-center gap-0.5">
        {showArchive && (
          <a
            href="https://ashutoshsundresh.com/archive.html#extracurriculars"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-1 rounded-[6px] px-2 py-1 text-[12px] text-[#3c3c43]/75 transition-colors hover:bg-black/[0.07] dark:text-white/70 dark:hover:bg-white/[0.10]"
          >
            Archive ↗
          </a>
        )}
        <button type="button" onClick={onOpenTerminal} className={TOOLBAR_BUTTON} aria-label="Terminal" title="Terminal">
          <Terminal className="h-[16px] w-[16px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className={TOOLBAR_BUTTON}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title="Appearance"
        >
          {isDark ? <Sun className="h-[16px] w-[16px]" strokeWidth={2} /> : <Moon className="h-[16px] w-[16px]" strokeWidth={2} />}
        </button>
        {onOpenSearch && (
          <button type="button" onClick={onOpenSearch} className={TOOLBAR_BUTTON} aria-label="Search" title="Search">
            <Search className="h-[16px] w-[16px]" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
