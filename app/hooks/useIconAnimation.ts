/**
 * Hook for animating icons on canvas
 */

import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SEMANTIC_COLORS } from '../constants/colors';
import { GAME_OF_LIFE_CONFIG } from '../constants/gameOfLife';
import type { IconInstance } from '../types/interestIcons';
import { ICON_ANIMATION_CONFIG } from '../constants/interestIcons';

// Cache for pre-rendered icon pixel data
const iconPixelCache = new Map<HTMLImageElement, { data: Uint8ClampedArray; width: number; height: number }>();

interface UseIconAnimationOptions {
  canvas: HTMLCanvasElement | null;
  icons: React.MutableRefObject<IconInstance[]>;
  iconsLoaded: boolean;
  isMobile: boolean;
}

export function useIconAnimation({
  canvas,
  icons,
  iconsLoaded,
  isMobile,
}: UseIconAnimationOptions): void {
  const animationFrameRef = useRef<number | undefined>(undefined);
  const { isDark } = useTheme();
  const cellSize = GAME_OF_LIFE_CONFIG.cellSize;
  const radius = (cellSize - 1) / 2;
  const { iconSize, spacing, speed } = ICON_ANIMATION_CONFIG;
  const scale = cellSize / 2; // Larger scale for sharper icons 

  useEffect(() => {
    if (!canvas || !iconsLoaded) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Set canvas size
    const updateSize = (): void => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const iconColor = isDark
      ? SEMANTIC_COLORS.gameOfLife.cellDark
      : SEMANTIC_COLORS.gameOfLife.cell;

    // Animation loop
    const animate = (): void => {
      if (icons.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cache leftmost/topmost positions to avoid recalculating
      let leftmostX: number | null = null;
      let topmostY: number | null = null;

      icons.current.forEach((instance) => {
        if (isMobile) {
          // Vertical movement: top to bottom
          instance.y += speed;

          // Reset position when off screen
          if (instance.y > canvas.height) {
            if (topmostY === null) {
              topmostY = Math.min(...icons.current.map((i) => i.y));
            }
            instance.y = topmostY - iconSize - spacing;
            instance.x = Math.random() * Math.max(0, canvas.width - iconSize);
            topmostY = instance.y; // Update cached value
          }
        } else {
          // Horizontal movement: left to right
          instance.x += speed;

          // Reset position when off screen
          if (instance.x > canvas.width) {
            if (leftmostX === null) {
              leftmostX = Math.min(...icons.current.map((i) => i.x));
            }
            instance.x = leftmostX - iconSize - spacing;
            instance.y = Math.random() * Math.max(0, canvas.height - iconSize);
            leftmostX = instance.x; // Update cached value
          }
        }

        // Draw icon with pixel style - only render visible icons
        const isVisible = isMobile
          ? instance.y > -iconSize * 2 && instance.y < canvas.height + iconSize * 2
          : instance.x > -iconSize * 2 && instance.x < canvas.width + iconSize * 2;

        if (isVisible && instance.image.complete) {
          drawIconAsPixels(ctx, instance, iconColor, iconSize, scale, radius);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvas, icons, iconsLoaded, isMobile, isDark, cellSize, radius, scale, spacing, speed, iconSize]);
}

/**
 * Draws an icon as pixel art circles
 * Uses caching to avoid reprocessing the same icon every frame
 */
function drawIconAsPixels(
  ctx: CanvasRenderingContext2D,
  instance: IconInstance,
  iconColor: string,
  iconSize: number,
  scale: number,
  radius: number
): void {
  // Check cache first
  let cachedData = iconPixelCache.get(instance.image);
  
  if (!cachedData) {
    // Create a temporary canvas to process the icon (only once)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = iconSize;
    tempCanvas.height = iconSize;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) {
      return;
    }

    // Draw icon to temp canvas
    tempCtx.drawImage(instance.image, 0, 0, iconSize, iconSize);

    // Get image data and cache it
    const imageData = tempCtx.getImageData(0, 0, iconSize, iconSize);
    cachedData = {
      data: imageData.data,
      width: iconSize,
      height: iconSize,
    };
    iconPixelCache.set(instance.image, cachedData);
  }

  const data = cachedData.data;
  ctx.fillStyle = iconColor;

  // Sample every 2nd pixel for better performance (still looks good)
  const pixelStep = 1;
  for (let y = 0; y < iconSize; y += pixelStep) {
    for (let x = 0; x < iconSize; x += pixelStep) {
      const idx = (y * iconSize + x) * 4;
      const alpha = data[idx + 3];

      if (alpha > 128) {
        // If pixel is visible
        const cx = instance.x + x * scale;
        const cy = instance.y + y * scale;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}


