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
  const [trailCells, setTrailCells] = useState<Map<string, { age: number; hasColor: boolean }>>(new Map()); // Map of cell key to trail state
  const [coloredLiveCells, setColoredLiveCells] = useState<Map<string, number>>(new Map()); // Map of cell key to color age (0-30)
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
      currentCells.forEach(key => {
        if (!newCells.has(key)) updatedDead.set(key, 0);
      });
      prevDead.forEach((age, key) => {
        if (!newCells.has(key) && age < maxTrailAge - 1) {
          updatedDead.set(key, age + 1);
        }
      });
      return updatedDead;
    });

    return newCells;
  }, [maxTrailAge]);

  // Animation loop
  // Animation loop: handles GOL generations, trail aging, and infection spreading
  useEffect(() => {
    const interval = setInterval(() => {
      setCells(prevCells => {
        const nextCells = getNextGeneration(prevCells);
        const newlyDead = Array.from(prevCells).filter(key => !nextCells.has(key));

        setColoredLiveCells(prevColored => {
          const nextColored = new Map<string, number>();

          nextCells.forEach(key => {
            if (prevColored.has(key)) {
              // Survivor ages up
              const currentAge = prevColored.get(key)!;
              if (currentAge < maxTrailAge - 1) {
                nextColored.set(key, currentAge + 1);
              }
              // If age reaches maxTrailAge, it stays alive but uninfected
            } else {
              const [x, y] = key.split(',').map(Number);
              const neighbors = getNeighbors(x, y);
              if (neighbors.some(n => prevColored.has(`${n.x},${n.y}`)) && Math.random() < 0.65) {
                nextColored.set(key, 0); // Becomes infected at age 0
              }
            }
          });

          setTrailCells(prevTrail => {
            const nextTrail = new Map(prevTrail);

            // Age existing trails
            prevTrail.forEach((data, key) => {
              if (data.age < maxTrailAge - 1) {
                nextTrail.set(key, { ...data, age: data.age + 1 });
              } else {
                nextTrail.delete(key);
              }
            });

            // Add newly dead colored cells - inherit their color age
            newlyDead.forEach(key => {
              if (prevColored.has(key)) {
                nextTrail.set(key, { age: prevColored.get(key)!, hasColor: true });
              }
            });

            return nextTrail;
          });

          return nextColored;
        });

        setDeadCells(prevDead => {
          const nextDead = new Map<string, number>();
          // Age existing gray cells
          prevDead.forEach((age, key) => {
            if (age < maxTrailAge - 1) nextDead.set(key, age + 1);
          });
          // Add newly dead gray cells
          newlyDead.forEach(key => nextDead.set(key, 0));
          return nextDead;
        });

        return nextCells;
      });
    }, GAME_OF_LIFE_CONFIG.animationInterval);
    return () => clearInterval(interval);
  }, [getNextGeneration, maxTrailAge]);

  // Draw cells
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dead cells (trail) with fading opacity
    const trailBaseColor = isDark
      ? [169, 177, 214] // trailDark
      : [120, 120, 120]; // trail
    const radius = (cellSize - 1) / 2;

    // Helper to lerp between two colors
    const lerp = (start: number[], end: number[], t: number) => {
      return start.map((s, i) => Math.round(s + (end[i] - s) * t));
    };

    const purple = [192, 132, 252];
    const pink = [244, 114, 182];
    const blue = [96, 165, 250];

    // Draw simulation death trail (gray)
    deadCells.forEach((age, key) => {
      if (trailCells.has(key)) return; // Don't overlap with colorful cursor trail
      const alpha = calculateTrailOpacity(age, maxTrailAge);
      const sizeMultiplier = calculateTrailSize(age, maxTrailAge);
      const [x, y] = key.split(',').map(Number);
      const cx = x * cellSize + cellSize / 2;
      const cy = y * cellSize + cellSize / 2;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${trailBaseColor[0]}, ${trailBaseColor[1]}, ${trailBaseColor[2]})`;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * sizeMultiplier, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw cursor and infectious trail (colorful)
    trailCells.forEach((data, cellKey) => {
      const { age, hasColor } = data;
      // Calculate fade opacity and size using utility functions
      let alpha = calculateTrailOpacity(age, maxTrailAge);
      if (hasColor) alpha *= 1.4; // Slightly increased from 0.4, but still subtle
      const sizeMultiplier = calculateTrailSize(age, maxTrailAge);

      const [x, y] = cellKey.split(',').map(Number);
      const cx = x * cellSize + cellSize / 2;
      const cy = y * cellSize + cellSize / 2;

      let color: number[];
      if (hasColor) {
        // Fast color cycle: goes through entire palette in 0.9 seconds (9 generations)
        // then stays gray for the remainder of the 3 seconds
        if (age < 3) {
          color = lerp(purple, pink, age / 3);
        } else if (age < 6) {
          color = lerp(pink, blue, (age - 3) / 3);
        } else if (age < 9) {
          color = lerp(blue, trailBaseColor, (age - 6) / 3);
        } else {
          color = trailBaseColor;
        }
      } else {
        color = trailBaseColor;
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
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

    cells.forEach(cellKey => {
      const [x, y] = cellKey.split(',').map(Number);
      const cx = x * cellSize + cellSize / 2;
      const cy = y * cellSize + cellSize / 2;

      // If cell is colored while alive, use the gradient based on its color age
      if (coloredLiveCells.has(cellKey)) {
        const age = coloredLiveCells.get(cellKey)!;
        let color: number[];
        // Fast color cycle: 0.9s total
        if (age < 3) {
          color = lerp(purple, pink, age / 3);
        } else if (age < 6) {
          color = lerp(pink, blue, (age - 3) / 3);
        } else if (age < 9) {
          color = lerp(blue, trailBaseColor, (age - 6) / 3);
        } else {
          color = trailBaseColor;
        }

        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.15)`;
        ctx.save();
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.35)`;
      } else {
        ctx.fillStyle = cellColor;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      if (coloredLiveCells.has(cellKey)) ctx.restore();
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
  }, [cells, dimensions, isHovering, hoverPosition, isDark, trailCells, deadCells, maxTrailAge, coloredLiveCells]);

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

      // Update trail age to 0 and set color chance whenever cursor touches a pixel
      setTrailCells(prev => {
        const next = new Map(prev);
        const existing = prev.get(key);
        const willBeColored = existing ? existing.hasColor : Math.random() < 0.8;
        next.set(key, {
          age: 0,
          hasColor: willBeColored
        });

        // Cursors draw infectious live cells too
        if (willBeColored) {
          setColoredLiveCells(prevColored => {
            const nextColored = new Map(prevColored);
            nextColored.set(key, 0); // Patient zero starts at age 0
            return nextColored;
          });
        }

        return next;
      });

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