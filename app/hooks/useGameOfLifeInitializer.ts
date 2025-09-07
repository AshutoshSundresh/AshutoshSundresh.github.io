'use client';

import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Dimensions } from '../types';

export default function useGameOfLifeInitializer(
  dimensions: Dimensions,
  cellSize: number,
  setCells: Dispatch<SetStateAction<Set<string>>>
) {
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const initialCells = new Set<string>();
    const width = Math.floor(dimensions.width / cellSize);
    const height = Math.floor(dimensions.height / cellSize);

    // Add patterns only if we have valid dimensions
    if (width > 0 && height > 0) {
      // Add Pinwheel mirroring the Pulsar position
      const pinwheelX = Math.floor(width * 0.45);  // 45% from the left (slightly more than Pulsar's 40%)
      const pinwheelY = height - 25;  // Mirror of Pulsar's Y position (which was at 10)
      const pinwheel = [
        // Center cross
        [3, 3], [4, 3], [5, 3],
        [3, 4], [4, 4], [5, 4],
        [3, 5], [4, 5], [5, 5],
        // Corner pieces
        [1, 1], [2, 1], [1, 2],
        [7, 1], [6, 1], [7, 2],
        [1, 7], [2, 7], [1, 6],
        [7, 7], [6, 7], [7, 6]
      ];

      pinwheel.forEach(([x, y]) => {
        initialCells.add(`${x + pinwheelX},${y + pinwheelY}`);
      });

      // Add Pulsar at the top
      const pulsarX = Math.floor(width * 0.4);  // 40% from the left
      const pulsarY = 10;  // Fixed distance from top
      const pulsar = [
        // Top section
        [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
        [0, 2], [5, 2], [7, 2], [12, 2],
        [0, 3], [5, 3], [7, 3], [12, 3],
        [0, 4], [5, 4], [7, 4], [12, 4],
        [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
        // Bottom section
        [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
        [0, 8], [5, 8], [7, 8], [12, 8],
        [0, 9], [5, 9], [7, 9], [12, 9],
        [0, 10], [5, 10], [7, 10], [12, 10],
        [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12]
      ];

      pulsar.forEach(([x, y]) => {
        initialCells.add(`${x + pulsarX},${y + pulsarY}`);
      });

      // Gosper's Glider Gun pattern
      const gosperGliderGun = [
        [0, 4], [1, 4], [0, 5], [1, 5],  // Block
        [10, 4], [10, 5], [10, 6],       // Left blinker
        [11, 3], [11, 7],
        [12, 2], [12, 8],
        [13, 2], [13, 8],
        [14, 5],
        [15, 3], [15, 7],
        [16, 4], [16, 5], [16, 6],
        [17, 5],
        [20, 2], [20, 3], [20, 4],       // Right blinker
        [21, 2], [21, 3], [21, 4],
        [22, 1], [22, 5],
        [24, 0], [24, 1], [24, 5], [24, 6],
        [34, 2], [34, 3],                 // Block
        [35, 2], [35, 3]
      ];

      // Add first Gosper's Glider Gun in top-right quadrant
      const gun1X = Math.floor(width * 0.7);
      const gun1Y = Math.floor(height * 0.2);
      gosperGliderGun.forEach(([x, y]) => {
        initialCells.add(`${x + gun1X},${y + gun1Y}`);
      });

      // Add second Gosper's Glider Gun in bottom-left quadrant, rotated 180 degrees
      const gun2X = Math.floor(width * 0.2);
      const gun2Y = Math.floor(height * 0.7);
      gosperGliderGun.forEach(([x, y]) => {
        initialCells.add(`${gun2X - x},${gun2Y - y}`); // Subtract coordinates for 180-degree rotation
      });

      // Small glider gun pattern in top-left
      const gliderGun = [
        [0, 4], [0, 5], [1, 4], [1, 5],
        [10, 4], [10, 5], [10, 6], [11, 3], [11, 7], [12, 2], [12, 8], [13, 2], [13, 8],
        [14, 5], [15, 3], [15, 7], [16, 4], [16, 5], [16, 6], [17, 5],
        [20, 2], [20, 3], [20, 4], [21, 2], [21, 3], [21, 4], [22, 1], [22, 5],
        [24, 0], [24, 1], [24, 5], [24, 6]
      ];

      // Blinker oscillator in top-right
      const blinker = [
        [width - 10, 10],
        [width - 10, 11],
        [width - 10, 12]
      ];

      // Toad oscillator in bottom-left
      const toad = [
        [10, height - 10],
        [10, height - 9],
        [10, height - 8],
        [11, height - 9],
        [11, height - 8],
        [11, height - 7]
      ];

      // Random cluster in bottom-right
      const randomCluster = [
        [width - 20, height - 20],
        [width - 19, height - 20],
        [width - 18, height - 20],
        [width - 19, height - 19],
        [width - 18, height - 18]
      ];

      // Add patterns along the top edge
      const topEdgePatterns = [
        // Small block
        [5, 5], [5, 6], [6, 5], [6, 6],
        // Blinker
        [15, 3], [15, 4], [15, 5],
        // Glider
        [25, 3], [26, 4], [27, 2], [27, 3], [27, 4],
        // Small block
        [35, 5], [35, 6], [36, 5], [36, 6],
        // Blinker
        [45, 3], [45, 4], [45, 5]
      ];

      // Add patterns along the bottom edge
      const bottomEdgePatterns = [
        // Small block
        [5, height - 6], [5, height - 5], [6, height - 6], [6, height - 5],
        // Blinker
        [15, height - 5], [15, height - 4], [15, height - 3],
        // Glider
        [25, height - 5], [26, height - 4], [27, height - 6], [27, height - 5], [27, height - 4],
        // Small block
        [35, height - 6], [35, height - 5], [36, height - 6], [36, height - 5],
        // Blinker
        [45, height - 5], [45, height - 4], [45, height - 3]
      ];

      // Add patterns closer to center
      const centerPatterns = [
        // Small glider gun near center
        [width/2 - 30, height/2 - 20],
        [width/2 - 29, height/2 - 20],
        [width/2 - 30, height/2 - 19],
        [width/2 - 29, height/2 - 19],
        [width/2 - 20, height/2 - 20],
        [width/2 - 20, height/2 - 19],
        [width/2 - 20, height/2 - 18],
        [width/2 - 19, height/2 - 21],
        [width/2 - 19, height/2 - 17],
        [width/2 - 18, height/2 - 22],
        [width/2 - 18, height/2 - 16],
        [width/2 - 17, height/2 - 22],
        [width/2 - 17, height/2 - 16],
        [width/2 - 16, height/2 - 19],
        [width/2 - 15, height/2 - 21],
        [width/2 - 15, height/2 - 17],
        [width/2 - 14, height/2 - 20],
        [width/2 - 14, height/2 - 19],
        [width/2 - 14, height/2 - 18],
        [width/2 - 13, height/2 - 19],

        // Pulsar near center
        [width/2 + 20, height/2 - 15],
        [width/2 + 20, height/2 - 14],
        [width/2 + 20, height/2 - 13],
        [width/2 + 20, height/2 - 8],
        [width/2 + 20, height/2 - 7],
        [width/2 + 20, height/2 - 6],
        [width/2 + 20, height/2 - 1],
        [width/2 + 20, height/2],
        [width/2 + 20, height/2 + 1],
        [width/2 + 20, height/2 + 6],
        [width/2 + 20, height/2 + 7],
        [width/2 + 20, height/2 + 8],
        [width/2 + 20, height/2 + 13],
        [width/2 + 20, height/2 + 14],
        [width/2 + 20, height/2 + 15],

        // Small block cluster
        [width/2 - 10, height/2 + 20],
        [width/2 - 9, height/2 + 20],
        [width/2 - 10, height/2 + 21],
        [width/2 - 9, height/2 + 21],
        [width/2 - 8, height/2 + 22],
        [width/2 - 7, height/2 + 22],
        [width/2 - 8, height/2 + 23],
        [width/2 - 7, height/2 + 23]
      ];

      // Add all patterns
      gliderGun.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });

      blinker.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });

      toad.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });

      randomCluster.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });

      // Add top and bottom edge patterns
      topEdgePatterns.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });

      bottomEdgePatterns.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });

      // Add center patterns
      centerPatterns.forEach(([x, y]) => {
        initialCells.add(`${x},${y}`);
      });
    }

    setCells(initialCells);
  }, [dimensions, cellSize, setCells]);
}


