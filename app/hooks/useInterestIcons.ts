/**
 * Hook for loading and managing interest icons
 */

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { IconInstance, InterestName } from '../types/interestIcons';
import { loadIcons, initializeHorizontalIcons, initializeVerticalIcons } from '../utils/iconUtils';
import { ICON_MAPPINGS } from '../constants/interestIcons';

interface UseInterestIconsOptions {
  interestName: InterestName;
  isMobile: boolean;
  iconSize: number;
  spacing: number;
  instanceCount: number;
}

interface UseInterestIconsResult {
  icons: React.MutableRefObject<IconInstance[]>;
  iconsLoaded: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useInterestIcons({
  interestName,
  isMobile,
  iconSize,
  spacing,
  instanceCount,
}: UseInterestIconsOptions): UseInterestIconsResult {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconsRef = useRef<IconInstance[]>([]);
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const iconNames = ICON_MAPPINGS[interestName];
    if (!iconNames || iconNames.length === 0) {
      iconsRef.current = [];
      setIconsLoaded(false);
      return;
    }

    // Reset icons when interest or mobile state changes
    iconsRef.current = [];
    setIconsLoaded(false);

    const loadAndInitializeIcons = async () => {
      const iconColorHex = isDark ? '#a9b1d6' : '#c8c8c8';
      const result = await loadIcons(iconNames, iconColorHex);

      if (!result.success) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      // Ensure canvas has dimensions
      if (canvas.width === 0 || canvas.height === 0) {
        if (canvas.parentElement) {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
        }
      }

      const instances = isMobile
        ? initializeVerticalIcons(
            result.icons,
            canvas.width,
            canvas.height,
            iconSize,
            spacing,
            instanceCount
          )
        : initializeHorizontalIcons(
            result.icons,
            canvas.width,
            canvas.height,
            iconSize,
            spacing,
            instanceCount
          );

      iconsRef.current = instances;
      setIconsLoaded(true);
    };

    loadAndInitializeIcons();
  }, [interestName, isDark, isMobile, iconSize, spacing, instanceCount]);

  return {
    icons: iconsRef,
    iconsLoaded,
    canvasRef,
  };
}


