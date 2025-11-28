/**
 * Game of Life Constants
 * 
 * Centralized configuration for Conway's Game of Life component
 */

export const GAME_OF_LIFE_CONFIG = {
  // Cell configuration
  cellSize: 7, // Size of each cell in pixels
  
  // Trail configuration
  maxTrailAge: 9, // Number of generations to show trail
  
  // Animation configuration
  animationInterval: 100, // Milliseconds between generations
  
  // Canvas initialization
  initDelay: 50, // Milliseconds delay for initial canvas setup
  
  // Trail fade configuration
  trail: {
    fadeExponent: 5.6, // Exponent for fade curve (higher = faster fade)
    maxOpacity: 0.55, // Maximum opacity for trail (0-1)
    sizeRange: {
      min: 0.45, // Minimum size multiplier (as fraction of radius)
      max: 0.9,  // Maximum size multiplier (as fraction of radius)
    },
  },
} as const;

