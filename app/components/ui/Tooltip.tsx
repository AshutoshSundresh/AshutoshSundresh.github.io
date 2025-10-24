"use client";
import { createPortal } from 'react-dom';
import type { TooltipProps } from '../../types';

/**
 * Tooltip component that renders in a portal at a specific position
 * Uses backdrop blur and floating design for modern look
 */
export default function Tooltip({ show, position, children, className = '' }: TooltipProps) {
  if (!show || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    (
      <div 
        className="fixed z-[10000] pointer-events-none"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: 'translateX(-50%)'
        }}
      >
        <div 
          className={`text-white text-xs px-4 py-3 rounded-lg shadow-2xl w-80 whitespace-normal border border-white/10 bg-black/50 backdrop-blur-lg ${className}`}
        >
          {children}
        </div>
      </div>
    ),
    document.body
  );
}

