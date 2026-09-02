'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Lock, Maximize2, Minimize2, Moon, Search, Sun, Terminal } from 'lucide-react';
import type { WindowHeaderProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { CHROME_MATERIAL, HAIRLINE, TOOLBAR_BUTTON, UI_FONT_STACK } from './skeumorphic/macos';

/**
 * Unified toolbar — Big Sur onward merges the title bar and toolbar into a
 * single row. History sits at the leading edge, the title is centred, and
 * every app action is an explicit labelled icon on the trailing edge.
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
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`relative flex h-[52px] shrink-0 items-center gap-3 border-b px-4 ${HAIRLINE} ${CHROME_MATERIAL}`}
      style={{ fontFamily: UI_FONT_STACK }}
    >
      {/* Leading: history, then the app actions */}
      <div className="relative z-10 flex items-center gap-0.5">
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

        {/* Gap separates history from the actions without drawing a rule */}
        <div className="ml-2 flex items-center gap-0.5">
          <button
            type="button"
            onClick={onZoom}
            className={TOOLBAR_BUTTON}
            aria-label={isZoomed ? 'Shrink window' : 'Expand window'}
            aria-pressed={isZoomed}
            title={isZoomed ? 'Shrink' : 'Expand'}
          >
            {isZoomed ? <Minimize2 className="h-[15px] w-[15px]" strokeWidth={2} /> : <Maximize2 className="h-[15px] w-[15px]" strokeWidth={2} />}
          </button>
          <button type="button" onClick={onToggleLockscreen} className={TOOLBAR_BUTTON} aria-label="Lock screen" title="Lock screen">
            <Lock className="h-[15px] w-[15px]" strokeWidth={2} />
          </button>
          {onOpenSearch && (
            <button type="button" onClick={onOpenSearch} className={TOOLBAR_BUTTON} aria-label="Search" title="Search">
              <Search className="h-[16px] w-[16px]" strokeWidth={2} />
            </button>
          )}
          <button type="button" onClick={onOpenTerminal} className={TOOLBAR_BUTTON} aria-label="Terminal" title="Terminal">
            <Terminal className="h-[16px] w-[16px]" strokeWidth={2} />
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

      {/* Trailing: appearance, then the Archive link on Activities */}
      <div className="relative z-10 ml-auto flex items-center gap-0.5">
        <button
          type="button"
          onClick={toggleTheme}
          className={TOOLBAR_BUTTON}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title="Appearance"
        >
          {isDark ? <Sun className="h-[16px] w-[16px]" strokeWidth={2} /> : <Moon className="h-[16px] w-[16px]" strokeWidth={2} />}
        </button>
        {showArchive && (
          <a
            href="https://ashutoshsundresh.com/archive.html#extracurriculars"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-[6px] px-2 py-1 text-[12px] text-[#3c3c43]/75 transition-colors hover:bg-black/[0.07] dark:text-white/70 dark:hover:bg-white/[0.10]"
          >
            Archive ↗
          </a>
        )}
      </div>
    </div>
  );
}
