"use client";
import Image from 'next/image';
import GameOfLife from './GameOfLife';
import NowPlaying from './NowPlaying';
import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function HeroSection() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scrollToNext = () => {
    const currentSection = document.querySelector('#hero-section');
    if (currentSection) {
      const parentSection = currentSection.closest('section');
      if (parentSection) {
        const nextSection = parentSection.nextElementSibling as HTMLElement | null;
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div id="hero-section" className="relative h-[100dvh] flex flex-col items-center justify-center bg-white p-4 md:p-8 snap-start snap-always">
      <GameOfLife />
      {/* Search icon top-right */}
      <button
        onClick={() => setIsSearchOpen(true)}
        aria-label="Search"
        className="absolute top-4 right-4 z-10 h-10 w-10 rounded-xl bg-black/40 hover:bg-black/50 text-white backdrop-blur-10 shadow-md ring-1 ring-white/10 flex items-center justify-center"
      >
        <Search className="h-5 w-5" />
      </button>
      <a
        href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
        target="_blank"
        rel="noopener noreferrer"
        data-search-title="Link — Game of Life overview"
        className="absolute top-4 left-4 text-sm text-gray-600 hover:text-gray-800 bg-white/50 px-2 py-1 rounded z-10"
      >
        Game of Life
      </a>
      <div className="absolute top-4 w-full flex justify-center z-1000">
        <NowPlaying />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 -mt-16 md:mt-0" data-search-title="Hero — Header">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center text-center md:text-left md:justify-start gap-2">
            <span className="text-5xl md:text-[62px] text-gray-900 font-bold animate-gradient bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text">Hey, I&apos;m</span>
            <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-2">
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 duration-300 card-elevated">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 z-10 pointer-events-none"></div>
                <Image src="/images/1755148353808.png" alt="Profile photo" width={64} height={64} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-5xl md:text-[62px] font-normal animate-gradient bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 text-transparent bg-clip-text">Ashutosh Sundresh</span>
          </div>

          <div className="flex flex-wrap items-center justify-center text-center md:text-left md:justify-start gap-2 mt-2" data-search-title="Hero — Tagline">
            <span className="text-5xl md:text-[62px]">
              <span className="text-5xl md:text-[62px] text-gray-500 font-light animate-gradient bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 text-transparent bg-clip-text">a </span>
              <span className="font-array text-[50px] md:text-[64px] animate-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Computer Science major</span>
            </span>
            <span className="text-5xl md:text-[62px] text-gray-500 font-light animate-gradient bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 text-transparent bg-clip-text">at</span>
            <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-2">
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 duration-300 card-elevated">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 z-10 pointer-events-none"></div>
                <Image src="/images/UCLA-square-logo.jpg" alt="UCLA" width={64} height={64} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-8" data-search-title="Social links">
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              <a href="https://twitter.com/asundresh" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 md:text-[14px] rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide">X</a>
              <a href="mailto:ashutoshsun@g.ucla.edu" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 md:text-[14px] rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide">Mail</a>
              <a href="https://github.com/ashutoshsundresh" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 md:text-[14px] rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide">GitHub</a>
              <a href="https://linkedin.com/in/asund" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 md:text-[14px] rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide">LinkedIn</a>
              <a href="https://scholar.google.com/citations?hl=en&user=FxDNxe4AAAAJ-lMfexRv3MFAahl78-mtZmAQ&user=FxDNxe4AAAAJ" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 md:text-[14px] rounded-md transition-all duration-300 bg-transparent hover:animate-button-gradient hover:bg-gradient-to-r hover:from-gray-50/60 hover:via-white/40 hover:to-gray-50/60 hover:text-gray-900 active:from-gray-100/80 active:via-gray-50/60 active:to-gray-100/80 active:transform active:translate-y-px hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] font-light tracking-wide">Scholar</a>
            </div>
            <button onClick={scrollToNext} className="bg-black/40 hover:bg-black/50 text-white backdrop-blur-10 shadow-md ring-1 ring-white/10 px-4 md:px-5 py-3 md:py-2.5 rounded-full text-sm md:text-[14px] transition-all duration-300 max-[390px]:hidden" aria-label="Scroll to next section" data-search-ignore="true"><ChevronDown className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      {/* Floating search overlay */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}


