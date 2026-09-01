/**
 * Header component for the Coursework Modal
 */

import { ReactNode } from 'react';
import { CHROME_MATERIAL, HAIRLINE, TRAFFIC_LIGHTS, UI_FONT_STACK } from '../skeumorphic/macos';

interface CourseworkModalHeaderProps {
  onClose: () => void;
  children?: ReactNode;
}

/** Unified toolbar matching the main window. Minimize/zoom are unavailable
 *  here, so they render as the dimmed circles AppKit uses for disabled controls. */
export default function CourseworkModalHeader({ onClose, children }: CourseworkModalHeaderProps) {
  return (
    <div
      className={`relative flex h-[52px] shrink-0 items-center justify-between border-b px-4 ${HAIRLINE} ${CHROME_MATERIAL}`}
      style={{ fontFamily: UI_FONT_STACK }}
    >
      <div className="flex items-center gap-[8px]">
        <button
          onClick={onClose}
          className="h-[12px] w-[12px] cursor-pointer rounded-full transition-transform duration-100 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/70"
          style={{ background: TRAFFIC_LIGHTS.close, boxShadow: `inset 0 0 0 0.5px ${TRAFFIC_LIGHTS.closeRing}` }}
          aria-label="Close"
          title="Close"
        >
          <span className="sr-only">Close</span>
        </button>
        <div className="h-[12px] w-[12px] rounded-full bg-black/15 dark:bg-white/15" aria-hidden="true" />
        <div className="h-[12px] w-[12px] rounded-full bg-black/15 dark:bg-white/15" aria-hidden="true" />
      </div>
      <div className="absolute left-1/2 hidden -translate-x-1/2 text-[13px] font-semibold text-[#1d1d1f] dark:text-white/90 md:block">
        Coursework
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

