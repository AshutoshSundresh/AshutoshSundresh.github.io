'use client';

import React from 'react';
import type { TabsBarProps } from '../types';
import { CHROME_MATERIAL, HAIRLINE, UI_FONT_STACK } from './skeumorphic/macos';

/**
 * macOS segmented control. Replaces the underline tab strip — AppKit uses a
 * recessed track with an elevated selected segment, which is what reads as
 * "native" rather than "web page".
 *
 * Scrolls horizontally instead of collapsing to a menu so every section stays
 * reachable at narrow window widths.
 */
export default function TabsBar({ tabs, activeTab, onSelect }: TabsBarProps) {
  return (
    <div
      className={`flex shrink-0 justify-center border-b px-3 py-[7px] ${HAIRLINE} ${CHROME_MATERIAL}`}
      style={{ fontFamily: UI_FONT_STACK }}
    >
      <div
        role="tablist"
        aria-label="Sections"
        className="flex max-w-full items-center gap-[2px] overflow-x-auto rounded-[8px] bg-black/[0.055] p-[2px] [scrollbar-width:none] dark:bg-white/[0.08] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(tab.id)}
              className={`relative h-[26px] shrink-0 whitespace-nowrap rounded-[6px] px-3 text-[13px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 ${
                selected
                  ? 'bg-white font-medium text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.16),0_0_0_0.5px_rgba(0,0,0,0.06)] dark:bg-[#5a5a5e] dark:text-white dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]'
                  : 'text-[#3c3c43]/80 hover:text-[#1d1d1f] dark:text-white/65 dark:hover:text-white/90'
              }`}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
