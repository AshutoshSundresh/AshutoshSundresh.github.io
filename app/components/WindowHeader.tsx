import React from 'react';
import Link from 'next/link';
import type { WindowHeaderProps } from '../types';

export default function WindowHeader({ onToggleLockscreen, onOpenTerminal }: WindowHeaderProps) {
  return (
    <div className="bg-gray-200 dark:bg-[#2b2b2b] px-4 py-2 flex items-center transition-colors">
      <div className="flex gap-2">
        <Link
          href="/"
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] active:bg-[#e6392f] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5f57]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-200 dark:focus-visible:ring-offset-[#2b2b2b] block"
          aria-label="Close"
        />
        <button
          type="button"
          onClick={onToggleLockscreen}
          className="w-3 h-3 rounded-full bg-[#ffbd44] hover:bg-[#ffcc00] active:bg-[#e6a82e] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffbd44]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-200 dark:focus-visible:ring-offset-[#2b2b2b]"
          aria-label="Minimize"
        />
        <button
          type="button"
          onClick={onOpenTerminal}
          className="w-3 h-3 rounded-full bg-[#00ca4e] hover:bg-[#00e55c] active:bg-[#00b03d] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ca4e]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-200 dark:focus-visible:ring-offset-[#2b2b2b]"
          aria-label="Zoom"
        />
      </div>

      <div className="flex-1 text-center text-sm text-gray-700 dark:text-gray-300 font-medium font-['Raleway']">Explore</div>

      <div className="w-16"></div>
    </div>
  );
}


