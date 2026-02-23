/**
 * Centralized Color Constants
 * 
 * This file contains all color values used throughout the application.
 * Colors are organized by category for easy maintenance and consistency.
 */

// ============================================================================
// BASE COLORS
// ============================================================================

export const BASE_COLORS = {
  // Pure colors
  black: '#000000',
  white: '#FFFFFF',

  // Gray scale (light mode)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Dark mode palette (material gray aesthetic)
  dark: {
    // Background shades
    bg: {
      primary: '#1a1b26',    // Main background - much darker
      secondary: '#16161e',  // Slightly darker for cards
      tertiary: '#0f0f14',   // Darkest for elevated elements
      elevated: '#24283b',   // Lighter for hover states
    },
    // Text shades
    text: {
      primary: '#c0caf5',    // Main text - brighter for better contrast
      secondary: '#a9b1d6',  // Secondary text
      tertiary: '#9aa5ce',   // Muted text
      disabled: '#565f89',   // Disabled text
    },
    // Border and divider colors
    border: {
      primary: '#292e42',
      secondary: '#1f2335',
    },
  },

  // MacOS Finder/Window specific dark colors
  macOS: {
    contentBg: '#1e1e1e',      // Main content area background
    sidebarBg: '#181818',      // Sidebar/detail view background
    sectionBg: '#202020',      // Section headers background
    cardBg: '#2b2b2b',         // Card/elevated elements background
    hoverBg: '#333333',        // Hover state background
  },

  // Blue scale
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },

  // Purple scale
  purple: {
    400: '#c084fc',
    500: '#a855f7',
  },

  // Pink scale
  pink: {
    400: '#f472b6',
  },

  // macOS window controls
  red: {
    500: '#ef4444',
  },
  yellow: {
    500: '#eab308',
  },
  green: {
    500: '#22c55e',
  },
} as const;

// ============================================================================
// SEMANTIC COLORS (Custom hex values used throughout the app)
// ============================================================================

export const SEMANTIC_COLORS = {
  // Selection & Interactive
  selection: '#0069d9',

  // Navigation
  navBackground: '#2A2A2A',
  navBackgroundLight: 'rgba(34, 34, 34, 1)', // Slightly darker shade for pressed state
  navBackgroundDark: 'rgba(27, 27, 27, 1)',
  navText: '#CCCCCC',

  // Terminal
  terminalGreen: '#33ff33',
  terminalBackground: 'rgba(0, 0, 0, 0.9)',

  // iOS Lockscreen gradient
  iosLockscreen: {
    top: '#1a001f',
    middle: '#320046',
    bottom: '#210024',
  },

  // Experience page gradient
  experienceGradient: {
    from: '#111111',
    to: '#0a0a0a',
  },

  // GitHub contributions
  contributionsBackground: '#282a36',

  // Game of Life
  gameOfLife: {
    // Light mode
    cell: 'rgba(200, 200, 200, 0.25)',
    cellHover: 'rgba(200, 200, 200, 0.45)',
    trail: 'rgba(120, 120, 120, 0.35)',
    // Dark mode variants
    cellDark: 'rgba(169, 177, 214, 0.12)',
    cellHoverDark: 'rgba(169, 177, 214, 0.16)',
    trailDark: 'rgba(169, 177, 214, 0.10)',
  },
} as const;

// ============================================================================
// OPACITY VALUES
// ============================================================================

export const OPACITY = {
  0: '0',
  5: '0.05',
  10: '0.1',
  12: '0.12',
  15: '0.15',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  55: '0.55',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  100: '1',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Apply opacity to a hex color
 * @param hex - Hex color string (e.g., '#000000')
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export function withOpacity(hex: string, opacity: number | string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Create commonly used black with opacity
 */
export function blackWithOpacity(opacity: number | string): string {
  return withOpacity(BASE_COLORS.black, opacity);
}

/**
 * Create commonly used white with opacity
 */
export function whiteWithOpacity(opacity: number | string): string {
  return withOpacity(BASE_COLORS.white, opacity);
}

// ============================================================================
// COMMONLY USED COLOR COMBINATIONS
// ============================================================================

export const COLOR_COMBINATIONS = {
  // Black with various opacities
  black: {
    5: blackWithOpacity(OPACITY[5]),
    10: blackWithOpacity(OPACITY[10]),
    30: blackWithOpacity(OPACITY[30]),
    40: blackWithOpacity(OPACITY[40]),
    50: blackWithOpacity(OPACITY[50]),
    60: blackWithOpacity(OPACITY[60]),
    70: blackWithOpacity(OPACITY[70]),
    80: blackWithOpacity(OPACITY[80]),
    90: blackWithOpacity(OPACITY[90]),
  },

  // White with various opacities
  white: {
    5: whiteWithOpacity(OPACITY[5]),
    10: whiteWithOpacity(OPACITY[10]),
    12: whiteWithOpacity(OPACITY[12]),
    15: whiteWithOpacity(OPACITY[15]),
    20: whiteWithOpacity(OPACITY[20]),
    30: whiteWithOpacity(OPACITY[30]),
    40: whiteWithOpacity(OPACITY[40]),
    60: whiteWithOpacity(OPACITY[60]),
  },

  // Glass morphism backgrounds
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },

  // Navigation pressed states
  navPressed: {
    background: 'linear-gradient(180deg, rgba(34, 34, 34, 1), rgba(27, 27, 27, 1))',
    inset1: 'rgba(0, 0, 0, 0.6)',
    inset2: 'rgba(0, 0, 0, 0.55)',
    glassInset1: 'rgba(71, 68, 68, 0.6)',
    glassInset2: 'rgba(104, 92, 92, 0.55)',
  },

  // Shadow colors
  shadows: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const GRADIENTS = {
  // Hero section button gradient
  buttonHover: {
    from: 'rgba(249, 250, 251, 0.6)', // gray-50/60
    via: 'rgba(255, 255, 255, 0.4)',  // white/40
    to: 'rgba(249, 250, 251, 0.6)',   // gray-50/60
  },
  buttonActive: {
    from: 'rgba(243, 244, 246, 0.8)', // gray-100/80
    via: 'rgba(249, 250, 251, 0.6)',  // gray-50/60
    to: 'rgba(243, 244, 246, 0.8)',   // gray-100/80
  },

  // Text gradients
  textPrimary: {
    from: BASE_COLORS.blue[400],
    via: BASE_COLORS.purple[400],
    to: BASE_COLORS.pink[400],
  },
  textGray: {
    from: BASE_COLORS.gray[500],
    via: BASE_COLORS.gray[400],
    to: BASE_COLORS.gray[500],
  },
  textDark: {
    from: BASE_COLORS.gray[900],
    via: BASE_COLORS.gray[700],
    to: BASE_COLORS.gray[900],
  },

  // Background gradients
  iosLockscreen: `linear-gradient(to bottom, ${SEMANTIC_COLORS.iosLockscreen.top}, ${SEMANTIC_COLORS.iosLockscreen.middle}, ${SEMANTIC_COLORS.iosLockscreen.bottom}, black)`,
  experiencePage: `linear-gradient(to bottom, ${SEMANTIC_COLORS.experienceGradient.from}, ${SEMANTIC_COLORS.experienceGradient.to})`,
  cardGradient: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))`,
} as const;

// ============================================================================
// TAILWIND CLASS MAPPINGS
// ============================================================================

/**
 * Common Tailwind color class combinations used throughout the app.
 * Use these for consistent styling patterns.
 */
export const TAILWIND_PATTERNS = {
  // Selection state
  selection: {
    active: 'bg-[#0069d9] text-white',
    hover: 'hover:bg-gray-100',
  },

  // Text colors
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-500',
    muted: 'text-gray-400',
    white: 'text-white',
    link: 'text-blue-500 hover:text-blue-600',
  },

  // Background colors
  background: {
    white: 'bg-white',
    gray50: 'bg-gray-50',
    gray100: 'bg-gray-100',
    gray200: 'bg-gray-200',
  },

  // Border colors
  border: {
    gray: 'border-gray-200',
    blue: 'border-blue-500',
  },

  // Interactive elements
  button: {
    hover: 'hover:bg-gray-200',
    hoverBlue: 'hover:bg-blue-50',
  },

  // Tags/badges
  tag: {
    purple: 'bg-purple-500/20',
    blue: 'bg-blue-50',
  },
} as const;

// ============================================================================
// DARK MODE THEME
// ============================================================================

export const DARK_MODE_COLORS = {
  // Background colors
  background: {
    primary: BASE_COLORS.dark.bg.primary,
    secondary: BASE_COLORS.dark.bg.secondary,
    tertiary: BASE_COLORS.dark.bg.tertiary,
    elevated: BASE_COLORS.dark.bg.elevated,
  },

  // Text colors
  text: {
    primary: BASE_COLORS.dark.text.primary,
    secondary: BASE_COLORS.dark.text.secondary,
    tertiary: BASE_COLORS.dark.text.tertiary,
    disabled: BASE_COLORS.dark.text.disabled,
  },

  // Component specific
  card: {
    background: BASE_COLORS.dark.bg.secondary,
    border: BASE_COLORS.dark.border.secondary,
    hover: BASE_COLORS.dark.bg.elevated,
  },

  // MacOS Finder/Window components
  macOS: {
    content: BASE_COLORS.macOS.contentBg,
    sidebar: BASE_COLORS.macOS.sidebarBg,
    section: BASE_COLORS.macOS.sectionBg,
    card: BASE_COLORS.macOS.cardBg,
    hover: BASE_COLORS.macOS.hoverBg,
  },

  // Navigation
  nav: {
    background: BASE_COLORS.dark.bg.tertiary,
    text: BASE_COLORS.dark.text.secondary,
  },

  // Interactive elements
  interactive: {
    hover: BASE_COLORS.dark.bg.elevated,
    active: '#4A5C7D',
    border: BASE_COLORS.dark.border.primary,
  },

  // Overlays
  overlay: withOpacity(BASE_COLORS.black, 0.7),
  glassLight: withOpacity(BASE_COLORS.white, 0.05),
  glassMedium: withOpacity(BASE_COLORS.white, 0.08),
  glassDark: withOpacity(BASE_COLORS.black, 0.3),
} as const;

// ============================================================================
// LIGHT MODE THEME
// ============================================================================

export const LIGHT_MODE_COLORS = {
  background: {
    primary: BASE_COLORS.white,
    secondary: BASE_COLORS.gray[50],
    tertiary: BASE_COLORS.gray[100],
    elevated: BASE_COLORS.white,
  },

  text: {
    primary: BASE_COLORS.gray[900],
    secondary: BASE_COLORS.gray[600],
    tertiary: BASE_COLORS.gray[500],
    disabled: BASE_COLORS.gray[400],
  },

  card: {
    background: BASE_COLORS.white,
    border: BASE_COLORS.gray[200],
    hover: BASE_COLORS.gray[50],
  },

  nav: {
    background: SEMANTIC_COLORS.navBackground,
    text: SEMANTIC_COLORS.navText,
  },

  interactive: {
    hover: BASE_COLORS.gray[100],
    active: BASE_COLORS.gray[200],
    border: BASE_COLORS.gray[300],
  },

  overlay: withOpacity(BASE_COLORS.black, 0.3),
  glassLight: withOpacity(BASE_COLORS.white, 0.1),
  glassMedium: withOpacity(BASE_COLORS.white, 0.2),
  glassDark: withOpacity(BASE_COLORS.black, 0.6),
} as const;

// ============================================================================
// THEME COLOR HELPERS
// ============================================================================

import type { Theme, ThemeColors } from '../types';

/**
 * Get the color palette for a given theme
 */
export function getThemeColors(theme: Theme): ThemeColors {
  return theme === 'dark' ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;
}

/**
 * Get a specific color value based on theme
 */
export function getColorForTheme(theme: Theme, lightColor: string, darkColor: string): string {
  return theme === 'dark' ? darkColor : lightColor;
}

/**
 * Darken a color by a given amount
 * @param rgb - RGB array [r, g, b]
 * @param amount - Amount to multiply each channel by (0-1)
 * @returns Darkened RGB array
 */
export function darkenColor([r, g, b]: number[], amount: number): number[] {
  return [
    Math.max(0, Math.floor(r * amount)),
    Math.max(0, Math.floor(g * amount)),
    Math.max(0, Math.floor(b * amount))
  ];
}

/**
 * Convert RGB array to hex string
 */
export function rgbToHex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// EXPORTS
// ============================================================================

const colors = {
  BASE_COLORS,
  SEMANTIC_COLORS,
  OPACITY,
  COLOR_COMBINATIONS,
  GRADIENTS,
  TAILWIND_PATTERNS,
  DARK_MODE_COLORS,
  LIGHT_MODE_COLORS,
  withOpacity,
  blackWithOpacity,
  whiteWithOpacity,
  getThemeColors,
  getColorForTheme,
  darkenColor,
  rgbToHex,
};

export default colors;

