import React from 'react';
import NowPlaying from './NowPlaying';
import IntroCards from './IntroCards';

export default function IntroSection() {
  return (
    <div
      id="intro-section"
      data-search-title="Intro"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 font-raleway bg-transparent"
    >
      <div className="absolute top-1 w-full flex justify-center z-1000">
        <NowPlaying disableFade={true} />
      </div>
      <div className="flex items-center justify-center w-full max-w-4xl mx-auto overflow-visible relative z-10">
        <IntroCards />
      </div>
    </div>
  );
}


