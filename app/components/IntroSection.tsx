import React from 'react';
import GameOfLife from './GameOfLife';
import NowPlaying from './NowPlaying';
import IntroCards from './IntroCards';
import useSectionVisibility from '../hooks/useSectionVisibility';

export default function IntroSection() {
  const { isVisible, sectionRef } = useSectionVisibility(0.1);

  return (
    <div
      id="intro-section"
      ref={sectionRef}
      data-search-title="Intro"
      className={`relative min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 font-raleway transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} bg-white dark:bg-dark-primary`}
    >
      <GameOfLife />
      <div className="absolute top-4 w-full flex justify-center z-1000">
        <NowPlaying />
      </div>
      <div className={`flex items-center justify-center w-full max-w-4xl mx-auto overflow-visible transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0' : 'translate-y-10'} relative z-10`}>
        <IntroCards />
      </div>
    </div>
  );
}


