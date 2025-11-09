"use client";

import MacOSTimelineCard from "./SkeumorphicMacOSInterface";
import { SEMANTIC_COLORS } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

export default function ExperiencePage() {
  const { isDark } = useTheme();
  
  return (
    <main 
      className="h-screen overflow-y-auto flex items-center justify-center p-4 no-top-blur"
      style={{ 
        background: isDark 
          ? '#1a1b26' 
          : `linear-gradient(to bottom, ${SEMANTIC_COLORS.experienceGradient.from}, ${SEMANTIC_COLORS.experienceGradient.to})` 
      }}
    >
      <div className="max-w-6xl w-full mx-auto py-20">
        <MacOSTimelineCard />
      </div>
    </main>
  );
}


