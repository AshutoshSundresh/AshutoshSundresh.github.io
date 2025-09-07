"use client";

import { useEffect, useRef } from 'react';
import { drawContributions } from 'github-contributions-canvas';
import type { ContributionsGraphProps } from '../types';

const ContributionsGraph: React.FC<ContributionsGraphProps> = ({ data, username }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-auto bg-[#282a36] block max-w-full img-no-gap"
    />
  );
};

export default ContributionsGraph; 