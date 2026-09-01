/**
 * Design tokens for the modern-macOS window chrome.
 *
 * These mirror the Big Sur → Tahoe lineage: a unified toolbar, translucent
 * "vibrancy" materials over the wallpaper, concentric corner radii, and the
 * system text style. Content surfaces stay opaque — only chrome is vibrant,
 * which is how AppKit actually renders it.
 */

/** Traffic-light fills (Big Sur onward). */
export const TRAFFIC_LIGHTS = {
  close: '#FF5F57',
  closeRing: '#E0443E',
  minimize: '#FEBC2E',
  minimizeRing: '#DEA123',
  zoom: '#28C840',
  zoomRing: '#1AAB29',
  inactive: '#D3D3D3',
  inactiveDark: '#4A4A4A',
} as const;

/**
 * SF Pro when the visitor is on a Mac, with sane fallbacks elsewhere.
 * Applied to chrome only; body copy keeps the site's Raleway identity.
 */
export const UI_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", system-ui, sans-serif';

/** Window shell: concentric radius + the layered shadow AppKit casts. */
export const WINDOW_RADIUS = 12;

export const WINDOW_SHADOW =
  '0 32px 64px -16px rgba(0,0,0,0.40), 0 16px 32px -16px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(0,0,0,0.14)';

export const WINDOW_SHADOW_DARK =
  '0 32px 64px -16px rgba(0,0,0,0.65), 0 16px 32px -16px rgba(0,0,0,0.50), 0 0 0 0.5px rgba(255,255,255,0.10)';

/**
 * Vibrancy material for toolbars/status bars. Saturation boost is what makes
 * the wallpaper bleed through with colour rather than looking like flat gray.
 */
export const CHROME_MATERIAL =
  'bg-[#f6f6f6]/80 dark:bg-[#2a2a2c]/75 backdrop-blur-2xl backdrop-saturate-[1.8]';

export const STATUS_MATERIAL =
  'bg-[#f6f6f6]/75 dark:bg-[#232325]/70 backdrop-blur-2xl backdrop-saturate-[1.8]';

/** Hairline separators — macOS uses sub-pixel dividers, not 1px solid gray. */
export const HAIRLINE = 'border-black/[0.09] dark:border-white/[0.09]';

/** Ghost toolbar button: square, subtle hover wash, no border until active. */
export const TOOLBAR_BUTTON =
  'inline-flex h-[26px] w-[26px] items-center justify-center rounded-[6px] text-[#3c3c43]/75 dark:text-white/70 ' +
  'transition-colors duration-150 hover:bg-black/[0.07] dark:hover:bg-white/[0.10] ' +
  'active:bg-black/[0.12] dark:active:bg-white/[0.16] ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 disabled:opacity-35 disabled:hover:bg-transparent';
