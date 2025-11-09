"use client";

import { useEffect, useRef } from 'react';
import { drawContributions } from 'github-contributions-canvas';
import type { ContributionsGraphProps } from '../types';
import { SEMANTIC_COLORS, getColorForTheme, BASE_COLORS } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

const ContributionsGraph: React.FC<ContributionsGraphProps> = ({ data, username }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (canvasRef.current && data) {
      // Set canvas dimensions - slightly larger for better visibility
      canvasRef.current.width = 860;  // Increased from 722
      canvasRef.current.height = 134; // Increased from 112

      drawContributions(canvasRef.current, {
        data,
        username,
        themeName: "pink",
        footerText: ""
      });
    }
  }, [data, username]);

  const backgroundColor = getColorForTheme(
    theme,
    SEMANTIC_COLORS.contributionsBackground,
    BASE_COLORS.dark.border.secondary
  );

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-auto block max-w-full img-no-gap"
      style={{ backgroundColor }}
    />
  );
};

export default ContributionsGraph; 