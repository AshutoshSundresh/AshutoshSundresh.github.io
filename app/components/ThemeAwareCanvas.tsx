"use client";

import { CSSProperties, forwardRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeAwareCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  lightBgColor?: string;
  darkBgColor?: string;
  applyDarkFilter?: boolean;
}

/**
 * Canvas component that adapts to dark mode
 * - Automatically switches background colors
 * - Optionally applies dark mode filter for content inversion
 */
const ThemeAwareCanvas = forwardRef<HTMLCanvasElement, ThemeAwareCanvasProps>(
  ({ lightBgColor, darkBgColor, applyDarkFilter = false, style, className, ...props }, ref) => {
    const { theme } = useTheme();
    
    const backgroundColor = theme === 'dark' && darkBgColor
      ? darkBgColor
      : lightBgColor;
    
    const canvasStyle: CSSProperties = {
      ...style,
      backgroundColor,
    };
    
    const canvasClassName = applyDarkFilter && theme === 'dark'
      ? `${className || ''} dark-mode-canvas-filter`
      : className;
    
    return (
      <canvas 
        ref={ref}
        style={canvasStyle}
        className={canvasClassName}
        {...props}
      />
    );
  }
);

ThemeAwareCanvas.displayName = 'ThemeAwareCanvas';

export default ThemeAwareCanvas;

