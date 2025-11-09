import React from 'react';
import type { ToolbarProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Toolbar({ onBack, onForward, canBack, canForward, showArchive, onOpenSearch }: ToolbarProps) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="bg-gray-100 dark:bg-[#202020] px-2 py-1 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          disabled={!canBack}
          className={`text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-['Raleway'] flex items-center ${!canBack ? 'text-gray-400 dark:text-gray-600 hover:bg-transparent cursor-not-allowed' : 'text-gray-700 dark:text-gray-300'}`}
        >
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={onForward}
          disabled={!canForward}
          className={`text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-['Raleway'] flex items-center ${!canForward ? 'text-gray-400 dark:text-gray-600 hover:bg-transparent cursor-not-allowed' : 'text-gray-700 dark:text-gray-300'}`}
        >
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Forward
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-['Raleway'] flex items-center text-gray-700 dark:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
        </button>
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-['Raleway'] flex items-center text-gray-700 dark:text-gray-300"
            aria-label="Search"
          >
            <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-3.8-3.8" />
            </svg>
          </button>
        )}
        {showArchive && (
          <a
            href="https://ashutoshsundresh.com/archive.html#extracurriculars"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-['Raleway'] flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 leading-none"
          >
            Archive →
          </a>
        )}
      </div>
    </div>
  );
}


