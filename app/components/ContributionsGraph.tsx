"use client";

import { useEffect, useRef } from 'react';
import { drawContributions } from 'github-contributions-canvas';

interface ContributionsGraphProps {
  data: {
    years: Array<{
      year: string;
      total: number;
      range: {
        start: string;
        end: string;
      };
      contributions: Array<{
        date: string;
        count: number;
        color: string;
      }>;
    }>;
    contributions: Array<{
      date: string;
      count: number;
      color: string;
      intensity: number;
    }>;
    total: number;
  };
  username: string;
}

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
        themeName: "standard",
        footerText: ""
      });
    }
  }, [data, username]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-auto bg-[#0d1117] scale-[1.02]"
      style={{ 
        maxWidth: '100%',
        display: 'block',
        transform: 'translateY(-1px)'  // Slight adjustment to remove any gap
      }}
    />
  );
};

export default ContributionsGraph; 