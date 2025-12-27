/**
 * Utility functions for icon loading and processing
 */

import type { IconInstance, IconLoadResult } from '../types/interestIcons';

/**
 * Colorizes an SVG string by replacing fill attributes
 */
export function colorizeSvg(svgText: string, colorHex: string): string {
  return svgText
    .replace(/fill="[^"]*"/g, `fill="${colorHex}"`)
    .replace(/fill='[^']*'/g, `fill="${colorHex}"`)
    .replace(/fill="currentColor"/g, `fill="${colorHex}"`);
}

/**
 * Loads a single icon from the public folder
 */
export async function loadIcon(iconName: string, colorHex: string): Promise<HTMLImageElement | null> {
  try {
    const response = await fetch(`/pixelarticons/${iconName}.svg`);
    if (!response.ok) {
      console.warn(`Failed to fetch icon ${iconName}`);
      return null;
    }

    const svgText = await response.text();
    const coloredSvg = colorizeSvg(svgText, colorHex);
    const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load icon ${iconName}`));
      };
      img.src = url;
    });

    return img;
  } catch (error) {
    console.warn(`Failed to load icon ${iconName}:`, error);
    return null;
  }
}

/**
 * Loads multiple icons
 */
export async function loadIcons(
  iconNames: readonly string[],
  colorHex: string
): Promise<IconLoadResult> {
  const loadedIcons: HTMLImageElement[] = [];

  for (const iconName of iconNames) {
    const icon = await loadIcon(iconName, colorHex);
    if (icon) {
      loadedIcons.push(icon);
    }
  }

  return {
    icons: loadedIcons,
    success: loadedIcons.length > 0,
  };
}

/**
 * Initializes icon instances for horizontal layout (left to right)
 */
export function initializeHorizontalIcons(
  icons: readonly HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  iconSize: number,
  spacing: number,
  count: number
): IconInstance[] {
  const instances: IconInstance[] = [];

  for (let i = 0; i < count; i++) {
    const icon = icons[Math.floor(Math.random() * icons.length)];
    // Random Y positions across the entire canvas height
    const y = Math.random() * Math.max(0, canvasHeight - iconSize);
    
    instances.push({
      image: icon,
      x: -iconSize - spacing * i,
      y: Math.max(0, y),
    });
  }

  return instances;
}

/**
 * Initializes icon instances for vertical layout (top to bottom)
 */
export function initializeVerticalIcons(
  icons: readonly HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  iconSize: number,
  spacing: number,
  count: number
): IconInstance[] {
  const instances: IconInstance[] = [];

  for (let i = 0; i < count; i++) {
    const icon = icons[Math.floor(Math.random() * icons.length)];
    // Random X positions across the entire canvas width
    const x = Math.random() * Math.max(0, canvasWidth - iconSize);
    
    instances.push({
      image: icon,
      x: Math.max(0, x),
      y: -iconSize - spacing * i,
    });
  }

  return instances;
}

