"use client";
import { useState } from 'react';
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import GameOfLife from "./components/GameOfLife";
import SearchOverlay from "./components/SearchOverlay";
import { Search, Moon, Sun } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  return (
    <main data-page="home" className="h-[100dvh] snap-y snap-mandatory overflow-y-auto smooth-scroll bg-white dark:bg-[#1e1e1e]">
      {/* Shared static background across both snap-scrolled pages */}
      <div className="fixed inset-0 w-full h-full z-0">
        <GameOfLife />
      </div>
      
      {/* Desktop-only controls - fixed position, visible across both pages */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-20">
        {/* Two-button pill top-right */}
        <div className="absolute top-4 right-6 pointer-events-auto flex rounded-full backdrop-blur-md shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
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
        
        {/* Game of Life link */}
        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noopener noreferrer"
          data-search-title="Link — Game of Life overview"
          className="absolute top-4 left-4 pointer-events-auto h-10 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 bg-white/60 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:hover:bg-[#2A2A2A]/70 px-4 rounded-full transition-all duration-300 backdrop-blur-md flex items-center border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          Game of Life
        </a>
      </div>
      
      <section className="h-[100dvh] snap-start snap-always relative z-10">
        <HeroSection onSearchOpen={() => setIsSearchOpen(true)} />
      </section>
      <section className="h-[100dvh] snap-start snap-always relative z-10">
        <IntroSection />
      </section>
      
      {/* Search overlay */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}