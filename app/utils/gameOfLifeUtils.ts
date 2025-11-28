/**
 * Game of Life Utility Functions
 * 
 * Helper functions for Game of Life calculations
 */

import { GAME_OF_LIFE_CONFIG } from '../constants/gameOfLife';

/**
 * Calculate fade opacity for a trail cell based on its age
 * @param age - Current age of the dead cell (0 = just died)
 * @param maxAge - Maximum age before cell disappears
 * @returns Opacity value between 0 and maxOpacity
 */
export function calculateTrailOpacity(age: number, maxAge: number): number {
  const normalizedAge = age / maxAge;
  const easedFade = Math.pow(normalizedAge, GAME_OF_LIFE_CONFIG.trail.fadeExponent);
  return Math.max(0, (1 - easedFade) * GAME_OF_LIFE_CONFIG.trail.maxOpacity);
}

/**
 * Calculate size multiplier for a trail cell based on its age
 * @param age - Current age of the dead cell (0 = just died)
 * @param maxAge - Maximum age before cell disappears
 * @returns Size multiplier between min and max size range
 */
export function calculateTrailSize(age: number, maxAge: number): number {
  const normalizedAge = age / maxAge;
  const easedFade = Math.pow(normalizedAge, GAME_OF_LIFE_CONFIG.trail.fadeExponent);
  const { min, max } = GAME_OF_LIFE_CONFIG.trail.sizeRange;
  return min + (1 - easedFade) * (max - min);
}

