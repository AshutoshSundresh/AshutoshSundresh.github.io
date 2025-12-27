/**
 * Icon mappings for each interest type
 */

import type { IconMappings } from '../types/interestIcons';

export const ICON_MAPPINGS: IconMappings = {
  'Fashion': ['human-handsup', 'image-flash', 'shopping-bag', 'sun-alt'],
  'Music': ['shuffle', 'music', 'next', 'moon'],
  'Game Modding': ['gamepad', 'gift', 'headset', 'heart'],
  'Film': ['movie', 'pause', 'picture-in-picture', 'play'],
  'Diecast Cars': ['car', 'speed-fast', 'downasaur', 'zap'],
} as const;

export const ICON_ANIMATION_CONFIG = {
  iconSize: 16,
  spacing: 100,
  speed: 5,
  instanceCount: 20,
} as const;

