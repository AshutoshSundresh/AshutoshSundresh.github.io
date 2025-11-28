"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Cell } from '../types';
import useGameOfLifeInitializer from '../hooks/useGameOfLifeInitializer';
import { SEMANTIC_COLORS } from '../constants/colors';
import { GAME_OF_LIFE_CONFIG } from '../constants/gameOfLife';
import { calculateTrailOpacity, calculateTrailSize } from '../utils/gameOfLifeUtils';
import { useTheme } from '../contexts/ThemeContext';

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState<Set<string>>(new Set());
  const cellSize = GAME_OF_LIFE_CONFIG.cellSize;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [deadCells, setDeadCells] = useState<Map<string, number>>(new Map()); // Map of cell key to age
  const { isDark } = useTheme();
  const maxTrailAge = GAME_OF_LIFE_CONFIG.maxTrailAge;

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

    // Initial call with a small delay to ensure proper mounting
    const initTimer = setTimeout(updateDimensions, GAME_OF_LIFE_CONFIG.initDelay);

    // Add event listener
    window.addEventListener('resize', updateDimensions);

    // Clean up
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(initTimer);
      // Clear the canvas on unmount
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
  }, []);

  useGameOfLifeInitializer(dimensions, cellSize, setCells);

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

  const getNextGeneration = useCallback((currentCells: Set<string>): Set<string> => {
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
      if (count === 3 || (count === 2 && currentCells.has(key))) {
        newCells.add(key);
      }
    });

    // Track dead cells (cells that were alive but are now dead)
    setDeadCells(prevDead => {
      const updatedDead = new Map<string, number>();
      
      // Age existing dead cells, but skip ones that are now alive
      prevDead.forEach((age, key) => {
        if (newCells.has(key)) {
          // Cell is now alive, don't include in dead cells
          return;
        }
        if (age < maxTrailAge - 1) {
          updatedDead.set(key, age + 1);
        }
      });
      
      // Add newly dead cells (were alive, now dead, and not already in dead cells)
      currentCells.forEach(key => {
        if (!newCells.has(key) && !prevDead.has(key)) {
          updatedDead.set(key, 0);
        }
      });
      
      return updatedDead;
    });

    return newCells;
  }, [maxTrailAge]);

  // Animation loop
  // Animation loop: always run; cell additions are merged between ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setCells(prevCells => getNextGeneration(prevCells));
    }, GAME_OF_LIFE_CONFIG.animationInterval);
    return () => clearInterval(interval);
  }, [getNextGeneration]);

  // Draw cells
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dead cells (trail) with fading opacity
    const trailColor = isDark 
      ? SEMANTIC_COLORS.gameOfLife.trailDark
      : SEMANTIC_COLORS.gameOfLife.trail;
    const radius = (cellSize - 1) / 2;
    
    deadCells.forEach((age, cellKey) => {
      // Calculate fade opacity and size using utility functions
      const alpha = calculateTrailOpacity(age, maxTrailAge);
      const sizeMultiplier = calculateTrailSize(age, maxTrailAge);
      
      const [x, y] = cellKey.split(',').map(Number);
      const cx = x * cellSize + cellSize / 2;
      const cy = y * cellSize + cellSize / 2;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = trailColor;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * sizeMultiplier, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw live cells as circles
    const cellColor = isDark 
      ? SEMANTIC_COLORS.gameOfLife.cellDark
      : SEMANTIC_COLORS.gameOfLife.cell;
    const hoverColor = isDark
      ? SEMANTIC_COLORS.gameOfLife.cellHoverDark
      : SEMANTIC_COLORS.gameOfLife.cellHover;
    
    ctx.fillStyle = cellColor;
    cells.forEach(cellKey => {
      const [x, y] = cellKey.split(',').map(Number);
      const cx = x * cellSize + cellSize / 2;
      const cy = y * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw hover cell
    if (isHovering && hoverPosition) {
      ctx.fillStyle = hoverColor;
      const cx = hoverPosition.x * cellSize + cellSize / 2;
      const cy = hoverPosition.y * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [cells, dimensions, isHovering, hoverPosition, isDark, deadCells, maxTrailAge]);

  // Add a cell at the specified position
  const addCell = (x: number, y: number) => {
    const key = `${x},${y}`;
    setCells(prevCells => {
      if (!prevCells.has(key)) {
        const newCells = new Set(prevCells);
        newCells.add(key);
        // Remove from dead cells if it exists there
        setDeadCells(prevDead => {
          const updated = new Map(prevDead);
          updated.delete(key);
          return updated;
        });
        return newCells;
      }
      return prevCells;
    });
  };

  // Global pointer handling to work even under overlays
  useEffect(() => {
    const lastCellKeyRef = { current: null as string | null };
    let rafId: number | null = null;
    let pending: { x: number; y: number; inside: boolean; ev: PointerEvent } | null = null;

    const process = () => {
      rafId = null;
      if (!pending) return;
      const { x, y, inside, ev } = pending;
      pending = null;

      if (!inside) {
        setIsHovering(false);
        setHoverPosition(null);
        lastCellKeyRef.current = null;
        return;
      }

      setHoverPosition({ x, y });
      setIsHovering(true);

      const key = `${x},${y}`;
      if (lastCellKeyRef.current !== key) {
        // Prevent page scroll when drawing via touch inside canvas bounds
        if (ev.pointerType === 'touch') {
          ev.preventDefault();
        }
        addCell(x, y);
        lastCellKeyRef.current = key;
      }
    };

    const schedule = (next: { x: number; y: number; inside: boolean; ev: PointerEvent }) => {
      pending = next;
      if (rafId == null) {
        rafId = window.requestAnimationFrame(process);
      }
    };

    const compute = (ev: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const inside = ev.clientX >= rect.left && ev.clientX < rect.right && ev.clientY >= rect.top && ev.clientY < rect.bottom;
      const x = Math.floor((ev.clientX - rect.left) / cellSize);
      const y = Math.floor((ev.clientY - rect.top) / cellSize);
      schedule({ x, y, inside, ev });
    };

    const onPointerMove = (ev: PointerEvent) => {
      compute(ev);
    };
    const onPointerDown = (ev: PointerEvent) => {
      compute(ev);
    };

    const listenerOptions: AddEventListenerOptions = { capture: true, passive: false };
    window.addEventListener('pointermove', onPointerMove, listenerOptions);
    window.addEventListener('pointerdown', onPointerDown, listenerOptions);

    return () => {
      window.removeEventListener('pointermove', onPointerMove, listenerOptions);
      window.removeEventListener('pointerdown', onPointerDown, listenerOptions);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto touch-none z-0"
    />
  );
} 