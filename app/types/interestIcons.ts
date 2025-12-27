/**
 * Types for interest icon animations
 */

export type InterestName = 'Fashion' | 'Music' | 'Game Modding' | 'Film' | 'Diecast Cars';

export interface IconInstance {
  image: HTMLImageElement;
  x: number;
  y: number;
}

export type IconMappings = {
  readonly [K in InterestName]: readonly string[];
};

export interface IconAnimationConfig {
  iconSize: number;
  spacing: number;
  speed: number;
  cellSize: number;
  radius: number;
}

export interface IconLoadResult {
  icons: HTMLImageElement[];
  success: boolean;
}

