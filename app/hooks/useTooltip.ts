import { useState, useRef, useCallback } from 'react';

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface UseTooltipReturn {
  showTooltip: boolean;
  tooltipPosition: TooltipPosition;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

/**
 * Hook for managing tooltip visibility and positioning
 * Calculates tooltip position based on button's bounding rect
 */
export function useTooltip(): UseTooltipReturn {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8
      });
    }
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return {
    showTooltip,
    tooltipPosition,
    buttonRef,
    handleMouseEnter,
    handleMouseLeave
  };
}

