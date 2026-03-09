import React from 'react';
import Link from 'next/link';
import { Home, Lock, Terminal } from 'lucide-react';
import type { WindowHeaderProps } from '../types';

const iconBtn =
  'p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-200 dark:focus-visible:ring-offset-[#2b2b2b]';

export default function WindowHeader({ onToggleLockscreen, onOpenTerminal }: WindowHeaderProps) {
  return (
    <div className="relative bg-gray-200 dark:bg-[#2b2b2b] px-4 py-2 flex items-center transition-colors">
      <div className="flex items-center gap-0.5 relative z-10">
        <Link href="/" className={iconBtn} aria-label="Home">
          <Home className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
        <button type="button" onClick={onToggleLockscreen} className={iconBtn} aria-label="Lock">
          <Lock className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
        <button type="button" onClick={onOpenTerminal} className={iconBtn} aria-label="Terminal">
          <Terminal className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium font-['Raleway']">Explore</span>
      </div>
    </div>
  );
}


