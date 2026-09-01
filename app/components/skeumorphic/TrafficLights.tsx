'use client';

import { TRAFFIC_LIGHTS } from './macos';

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
  isZoomed: boolean;
}

const DOT =
  'group/dot relative h-[12px] w-[12px] rounded-full transition-transform duration-100 active:scale-90 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/70 focus-visible:ring-offset-1';

/**
 * macOS window controls. Glyphs stay hidden until the cluster is hovered,
 * matching AppKit — the dots read as pure colour at rest.
 */
export default function TrafficLights({ onClose, onMinimize, onZoom, isZoomed }: TrafficLightsProps) {
  return (
    <div className="group/lights flex items-center gap-[8px]" aria-label="Window controls">
      <button
        type="button"
        onClick={onClose}
        className={DOT}
        style={{ background: TRAFFIC_LIGHTS.close, boxShadow: `inset 0 0 0 0.5px ${TRAFFIC_LIGHTS.closeRing}` }}
        aria-label="Close — back to home"
        title="Close"
      >
        <svg
          viewBox="0 0 12 12"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-100 group-hover/lights:opacity-100"
          aria-hidden="true"
        >
          <path d="M3.8 3.8l4.4 4.4M8.2 3.8l-4.4 4.4" stroke="#4D0000" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onMinimize}
        className={DOT}
        style={{ background: TRAFFIC_LIGHTS.minimize, boxShadow: `inset 0 0 0 0.5px ${TRAFFIC_LIGHTS.minimizeRing}` }}
        aria-label="Minimize — show lock screen"
        title="Minimize"
      >
        <svg
          viewBox="0 0 12 12"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-100 group-hover/lights:opacity-100"
          aria-hidden="true"
        >
          <path d="M3.4 6h5.2" stroke="#5A3B00" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onZoom}
        className={DOT}
        style={{ background: TRAFFIC_LIGHTS.zoom, boxShadow: `inset 0 0 0 0.5px ${TRAFFIC_LIGHTS.zoomRing}` }}
        aria-label={isZoomed ? 'Zoom out window' : 'Zoom window'}
        aria-pressed={isZoomed}
        title="Zoom"
      >
        <svg
          viewBox="0 0 12 12"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-100 group-hover/lights:opacity-100"
          aria-hidden="true"
        >
          <path
            d="M4.2 7.8V4.2h3.6"
            fill="none"
            stroke="#00450A"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(-45 6 6)"
          />
        </svg>
      </button>
    </div>
  );
}
