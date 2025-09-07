"use client";

import { useEffect, useRef, useState } from 'react';
import useGameOfLifeInitializer from '../hooks/useGameOfLifeInitializer';

interface Cell {
  x: number;
  y: number;
}

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(true);
  const cellSize = 6; // Size of each cell in pixels
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

    // Initial call with a small delay to ensure proper mounting
    const initTimer = setTimeout(updateDimensions, 50);

    // Add event listener
    window.addEventListener('resize', updateDimensions);

    // Clean up
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(initTimer);
      // Clear the canvas on unmount
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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