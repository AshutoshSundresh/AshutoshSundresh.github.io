"use client";

import { useEffect, useRef, useState } from 'react';

interface Cell {
  x: number;
  y: number;
}

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(true);
  const cellSize = 4; // Size of each cell in pixels
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas and handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize with interesting patterns
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const initialCells = new Set<string>();
    const width = Math.floor(dimensions.width / cellSize);
    const height = Math.floor(dimensions.height / cellSize);

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

    setCells(initialCells);
  }, [dimensions, cellSize]);

  // Game of Life logic
  const getNeighbors = (x: number, y: number): Cell[] => {
    const neighbors: Cell[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        neighbors.push({ x: x + i, y: y + j });
      }
    }
    return neighbors;
  };

  const getNextGeneration = (currentCells: Set<string>): Set<string> => {
    const newCells = new Set<string>();
    const neighborCounts = new Map<string, number>();

    // Count neighbors for each cell
    currentCells.forEach(cellKey => {
      const [x, y] = cellKey.split(',').map(Number);
      getNeighbors(x, y).forEach(neighbor => {
        const key = `${neighbor.x},${neighbor.y}`;
        neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
      });
    });

    // Apply rules
    neighborCounts.forEach((count, key) => {
      const [x, y] = key.split(',').map(Number);
      if (count === 3 || (count === 2 && currentCells.has(key))) {
        newCells.add(key);
      }
    });

    return newCells;
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCells(prevCells => getNextGeneration(prevCells));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Draw cells
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    cells.forEach(cellKey => {
      const [x, y] = cellKey.split(',').map(Number);
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    });

    // Draw hover cell
    if (isHovering && hoverPosition) {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.fillRect(
        hoverPosition.x * cellSize,
        hoverPosition.y * cellSize,
        cellSize,
        cellSize
      );
    }
  }, [cells, dimensions, isHovering, hoverPosition]);

  // Add a cell at the specified position
  const addCell = (x: number, y: number) => {
    const key = `${x},${y}`;
    setCells(prevCells => {
      if (!prevCells.has(key)) {
        const newCells = new Set(prevCells);
        newCells.add(key);
        return newCells;
      }
      return prevCells;
    });
  };

  // Handle mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    
    setHoverPosition({ x, y });
    setIsHovering(true);
    addCell(x, y);
  };

  // Handle touch interaction
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.floor((touch.clientX - rect.left) / cellSize);
    const y = Math.floor((touch.clientY - rect.top) / cellSize);
    
    addCell(x, y);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.floor((touch.clientX - rect.left) / cellSize);
    const y = Math.floor((touch.clientY - rect.top) / cellSize);
    
    addCell(x, y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoverPosition(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      className="absolute inset-0 w-full h-full pointer-events-auto touch-none"
      style={{ zIndex: 0 }}
    />
  );
} 