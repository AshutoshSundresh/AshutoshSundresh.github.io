"use client";
import Image from 'next/image';
import NowPlaying from './NowPlaying';
import { useState } from 'react';
import { Search, ChevronDown, Moon, Sun } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import { useTheme } from '../contexts/ThemeContext';

export default function HeroSection() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
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
    <div id="hero-section" className="relative h-[100dvh] flex flex-col items-center justify-center bg-transparent pt-10 px-4 pb-4 md:p-8 snap-start snap-always transition-colors duration-300">
      {/* Two-button pill top-right */}
      <div className="absolute top-4 right-4 z-10 flex rounded-full backdrop-blur-md shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="h-10 w-10 bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all duration-300"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
          className="h-10 w-10 bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all duration-300"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      <a
        href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
        target="_blank"
        rel="noopener noreferrer"
        data-search-title="Link — Game of Life overview"
        className="absolute top-4 left-4 h-10 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 px-4 rounded-full z-10 transition-all duration-300 backdrop-blur-md flex items-center border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        Game of Life
      </a>
      <div className="absolute top-4 w-full flex justify-center z-1000">
        <NowPlaying />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 -mt-16 md:mt-0" data-search-title="Hero — Header">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center text-center md:text-left md:justify-start gap-2">
            <span className="text-5xl md:text-[62px] text-gray-900 dark:text-gray-100 font-bold">Hey, I&apos;m</span>
            <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-2">
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 duration-300 card-elevated border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent h-1/2 z-10 pointer-events-none"></div>
                <Image src="/images/1755148353808.png" alt="Profile photo" width={64} height={64} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-5xl md:text-[62px] font-normal text-gray-900 dark:text-gray-100">Ashutosh Sundresh</span>
          </div>

          <div className="flex flex-wrap items-center justify-center text-center md:text-left md:justify-start gap-2 mt-2" data-search-title="Hero — Tagline">
            <span className="text-5xl md:text-[62px]">
              <span className="text-5xl md:text-[62px] text-gray-500 dark:text-gray-400 font-light">a </span>
              <span className="font-array text-[50px] md:text-[64px] animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">Computer Science major</span>
            </span>
            <span className="text-5xl md:text-[62px] text-gray-500 dark:text-gray-400 font-light">at</span>
            <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-2">
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 duration-300 card-elevated border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent h-1/2 z-10 pointer-events-none"></div>
                <Image src="/images/UCLA-square-logo.jpg" alt="UCLA" width={64} height={64} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-8" data-search-title="Social links">
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              <a href="https://twitter.com/asundresh" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 dark:text-gray-400 md:text-[14px] transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-200 font-light tracking-wide">X</a>
              <a href="mailto:ashutoshsun@g.ucla.edu" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 dark:text-gray-400 md:text-[14px] transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-200 font-light tracking-wide">Mail</a>
              <a href="https://github.com/ashutoshsundresh" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 dark:text-gray-400 md:text-[14px] transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-200 font-light tracking-wide">GitHub</a>
              <a href="https://linkedin.com/in/asund" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 dark:text-gray-400 md:text-[14px] transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-200 font-light tracking-wide">LinkedIn</a>
              <a href="https://scholar.google.com/citations?hl=en&user=FxDNxe4AAAAJ-lMfexRv3MFAahl78-mtZmAQ&user=FxDNxe4AAAAJ" target="_blank" rel="noopener noreferrer" className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 dark:text-gray-400 md:text-[14px] transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-200 font-light tracking-wide">Scholar</a>
            </div>
            <button onClick={scrollToNext} className="bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 text-gray-700 dark:text-gray-200 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-4 md:px-5 py-3 md:py-2.5 rounded-full text-sm md:text-[14px] transition-all duration-300 max-[390px]:hidden" aria-label="Scroll to next section" data-search-ignore="true"><ChevronDown className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      {/* Floating search overlay */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}


