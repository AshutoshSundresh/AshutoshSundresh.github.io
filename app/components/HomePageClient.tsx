"use client";

import { useState } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import GameOfLife from "./GameOfLife";
import SearchOverlay from "./SearchOverlay";
import { useTheme } from '../contexts/ThemeContext';

export default function HomePageClient() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  return (
    <main data-page="home" className="h-[100dvh] snap-y snap-mandatory overflow-y-auto smooth-scroll bg-white dark:bg-[#1e1e1e]">
      <div className="fixed inset-0 z-0 h-full w-full">
        <GameOfLife />
      </div>

      <div className="fixed inset-0 z-20 hidden pointer-events-none md:block">
        <div className="absolute top-4 right-6 flex overflow-hidden rounded-full border border-gray-200/50 shadow-lg backdrop-blur-md pointer-events-auto dark:border-gray-700/50">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center bg-white/60 text-gray-700 transition-all duration-300 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:text-gray-200 dark:hover:bg-[#2A2A2A]/70"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="w-px bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center bg-white/60 text-gray-700 transition-all duration-300 hover:bg-white/70 dark:bg-[#2A2A2A]/60 dark:text-gray-200 dark:hover:bg-[#2A2A2A]/70"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noopener noreferrer"
          data-search-title="Link — Game of Life overview"
          className="absolute top-4 left-4 flex h-10 items-center rounded-full border border-gray-200/50 bg-white/60 px-4 text-sm text-gray-600 shadow-lg transition-all duration-300 hover:bg-white/70 hover:text-gray-800 pointer-events-auto dark:border-gray-700/50 dark:bg-[#2A2A2A]/60 dark:text-gray-300 dark:hover:bg-[#2A2A2A]/70 dark:hover:text-gray-100"
        >
          Game of Life
        </a>
      </div>

      <section className="relative z-10 h-[100dvh] snap-start snap-always">
        <HeroSection onSearchOpen={() => setIsSearchOpen(true)} />
      </section>
      <section className="relative z-10 h-[100dvh] snap-start snap-always">
        <IntroSection />
      </section>

      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  );
}
