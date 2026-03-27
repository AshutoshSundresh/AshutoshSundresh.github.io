"use client";

import MacOSTimelineCard from "./SkeumorphicMacOSInterface";
import { SEMANTIC_COLORS } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';
import useWindowInfo from '../hooks/useWindowInfo';

export default function ExperiencePage() {
  const { isDark } = useTheme();
  const { isMobile, isReady } = useWindowInfo();

  if (!isReady) {
    return (
      <main
        className="h-[100dvh] w-full overflow-hidden p-0 no-top-blur"
        style={{
          background: isDark
            ? '#1a1b26'
            : `linear-gradient(to bottom, ${SEMANTIC_COLORS.experienceGradient.from}, ${SEMANTIC_COLORS.experienceGradient.to})`
        }}
      />
    );
  }

  if (isMobile) {
    return <MacOSTimelineCard />;
  }
  
  return (
    <main 
      className="h-[100dvh] overflow-hidden md:overflow-y-auto flex items-center justify-center p-0 md:p-4 no-top-blur"
      style={{ 
        background: isDark 
          ? '#1a1b26' 
          : `linear-gradient(to bottom, ${SEMANTIC_COLORS.experienceGradient.from}, ${SEMANTIC_COLORS.experienceGradient.to})` 
      }}
    >
      <div className="h-full w-full max-w-none md:max-w-6xl mx-auto py-0 md:py-20">
        <MacOSTimelineCard />
      </div>
    </main>
  );
}


