import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS } from '../constants/colors';
import type { ThemeColors } from '../types';

/**
 * Hook to get the current theme's color palette
 * Returns the appropriate color scheme based on light/dark mode
 */
export function useThemeColors(): ThemeColors {
  const { theme } = useTheme();
  
  return useMemo(() => {
    return theme === 'dark' ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;
  }, [theme]);
}

/**
 * Hook to get a specific color value that changes with theme
 * @param lightColor - Color to use in light mode
 * @param darkColor - Color to use in dark mode
 */
export function useThemeColor(lightColor: string, darkColor: string): string {
  const { theme } = useTheme();
  return theme === 'dark' ? darkColor : lightColor;
}

